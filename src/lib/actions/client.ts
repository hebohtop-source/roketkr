import { headers } from "next/headers"
import { auth } from "../auth/server"

import z from "zod/v4"
import { db } from "@/db"
import { auditLog } from "@/db/schema"

// ─────────────────────────────────────────────
// AUDIT HELPERS
// ─────────────────────────────────────────────

const SCRUBBED_KEYS = ["password", "token", "cardNumber", "cvv", "secret"]

function scrubForAudit(data: unknown): unknown {
  if (typeof data !== "object" || data === null) return data
  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).map(([k, v]) => [
      k,
      SCRUBBED_KEYS.includes(k) ? "[redacted]" : v,
    ])
  )
}

function getCallerInfo(): string {
  const stack = new Error().stack ?? ""
  const lines = stack.split("\n")
  // 0 = Error, 1 = getCallerInfo, 2 = action() wrapper, 3 = the file that called action()
  const callerLine = lines[3] ?? ""
  // extracts something like "app/actions/photos.ts:42:18"
  const match = callerLine.match(/([^/]+\.ts):\d+:\d+/)
  return match?.[1] ?? "unknown"
}

function writeAuditLog(entry: {
  userId: string
  action: string
  success: boolean
  metadata: unknown
}) {
  db.insert(auditLog)
    .values({
      userId: entry.userId,
      action: entry.action,
      success: entry.success,
      metadata: JSON.stringify(scrubForAudit(entry.metadata)),
    })
    .catch(console.error) // fire-and-forget, never throws into caller
}

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type ActionResult<T> =
  | { data: T; error: null; validationError: null }
  | { data: null; error: string; validationError: null }
  | { data: null; error: null; validationError: Record<string, string[]> }

// ─────────────────────────────────────────────
// PUBLIC ACTION (no auth, no audit)
// ─────────────────────────────────────────────

function createActionClient() {
  return function action<TInput, TOutput>(config: {
    schema: z.ZodType<TInput>
    handler: (input: TInput) => Promise<TOutput>
  }) {
    return async (rawInput: unknown): Promise<ActionResult<TOutput>> => {
      const parsed = config.schema.safeParse(rawInput)
      if (!parsed.success) {
        return {
          data: null,
          error: null,
          validationError: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        }
      }
      try {
        const data = await config.handler(parsed.data)
        return { data, error: null, validationError: null }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong"
        return { data: null, error: message, validationError: null }
      }
    }
  }
}

// ─────────────────────────────────────────────
// PROTECTED ACTION (auth required, auto-audited)
// ─────────────────────────────────────────────

function createProtectedActionClient() {
  return function action<TInput, TOutput>(config: {
    schema: z.ZodType<TInput>
    actionName?: string  // optional — inferred from call site if omitted
    handler: (input: TInput, ctx: { userId: string }) => Promise<TOutput>
  }) {
    return async (rawInput: unknown): Promise<ActionResult<TOutput>> => {
      const inferredName = getCallerInfo() // called here so stack depth is correct

      const session = await auth.api.getSession({
        headers: await headers(),
      })
      if (!session?.user) {
        return { data: null, error: "Unauthorized", validationError: null }
      }

      const parsed = config.schema.safeParse(rawInput)
      if (!parsed.success) {
        return {
          data: null,
          error: null,
          validationError: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        }
      }

      let success = false
      try {
        const data = await config.handler(parsed.data, { userId: session.user.id })
        success = true
        return { data, error: null, validationError: null }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong"
        return { data: null, error: message, validationError: null }
      } finally {
        writeAuditLog({
          userId: session.user.id,
          action: config.actionName ?? inferredName,
          success,
          metadata: parsed.data,
        })
      }
    }
  }
}

export const publicAction = createActionClient()
export const protectedAction = createProtectedActionClient()
