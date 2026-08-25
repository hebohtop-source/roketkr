// lib/audit.ts
import { db } from "@/db"
import { auditLog } from "@/db/schema"
import { auth } from "@/lib/auth/server"
import { headers } from "next/headers"

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

export async function withAudit<T>(
  action: string,
  metadata: unknown,
  fn: () => Promise<T>
): Promise<T> {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session?.user?.id ?? null

  let success = false
  try {
    const result = await fn()
    success = true
    return result
  } finally {
    db.insert(auditLog).values({
      userId,
      action,
      success,
      metadata: JSON.stringify(scrubForAudit(metadata)),
    }).catch(console.error)
  }
}
