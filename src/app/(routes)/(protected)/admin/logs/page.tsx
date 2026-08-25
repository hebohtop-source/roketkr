
import { desc, eq, like, and } from "drizzle-orm"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { db } from "@/db"
import { auditLog, user } from "@/db/schema"

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
})

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type AuditLogRow = {
  id: string
  action: string
  success: boolean
  metadata: string | null
  createdAt: Date | null
  user: { id: string; name: string; email: string } | null
}

// ─────────────────────────────────────────────
// Search params
// ─────────────────────────────────────────────

type PageProps = {
  searchParams: Promise<{
    action?: string
    status?: string
    search?: string
  }>
}

// ─────────────────────────────────────────────
// Data fetching
// ─────────────────────────────────────────────

async function getLogs(filters: {
  action?: string
  status?: string
  search?: string
}): Promise<AuditLogRow[]> {
  const conditions = []

  if (filters.action && filters.action !== "all") {
    conditions.push(like(auditLog.action, `${filters.action}.%`))
  }

  if (filters.status === "success") {
    conditions.push(eq(auditLog.success, true))
  } else if (filters.status === "failed") {
    conditions.push(eq(auditLog.success, false))
  }

  const rows = await db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      success: auditLog.success,
      metadata: auditLog.metadata,
      createdAt: auditLog.createdAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
    .from(auditLog)
    .leftJoin(user, eq(auditLog.userId, user.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(auditLog.createdAt))
    .limit(200)

  if (filters.search) {
    const q = filters.search.toLowerCase()
    return rows.filter(
      (r) =>
        r.user?.email?.toLowerCase().includes(q) ||
        r.user?.name?.toLowerCase().includes(q) ||
        r.action.toLowerCase().includes(q)
    )
  }

  return rows
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getActionCategory(action: string) {
  return action.split(".")[0] ?? "unknown"
}

const categoryColors: Record<string, string> = {
  order: "bg-blue-50 text-blue-700 border-blue-200",
  photo: "bg-purple-50 text-purple-700 border-purple-200",
  product: "bg-orange-50 text-orange-700 border-orange-200",
  user: "bg-gray-50 text-gray-700 border-gray-200",
  review: "bg-yellow-50 text-yellow-700 border-yellow-200",
}

function actionBadgeClass(action: string) {
  const cat = getActionCategory(action)
  return categoryColors[cat] ?? "bg-gray-50 text-gray-700 border-gray-200"
}

// ─────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────

function MetadataCell({ raw }: { raw: string | null }) {
  if (!raw) return null

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(raw)
  } catch {
    return <span>{raw}</span>
  }

  const entries = Object.entries(parsed)
  if (entries.length === 0) return null

  const [firstKey, firstVal] = entries[0]!
  const rest = entries.slice(1)

  return (
    <Collapsible>
      <div>
        <span>
          {firstKey}: {String(firstVal)}
        </span>

        {rest.length > 0 && (
          <CollapsibleTrigger>
            <button className="text-xs text-muted-foreground ml-2">
              +{rest.length} ещё
            </button>
          </CollapsibleTrigger>
        )}
      </div>

      {rest.length > 0 && (
        <CollapsibleContent>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            {rest.map(([k, v]) => (
              <div key={k}>
                {k}: {String(v)}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default async function AuditLogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const logs = await getLogs(params)

  const uniqueCategories = [
    ...new Set(logs.map((l) => getActionCategory(l.action))),
  ].sort()

  return (
    <div>
      {/* Header */}
      <h1>Журнал аудита</h1>
      <p>{logs.length} событий</p>

      {/* Filters */}
      <form className="flex flex-wrap gap-3">
        <Input
          name="search"
          placeholder="Поиск пользователя или действия…"
          defaultValue={params.search}
          className="w-60"
        />

        <Select name="action" defaultValue={params.action ?? "all"}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {uniqueCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select name="status" defaultValue={params.status ?? "all"}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="success">Успешно</SelectItem>
            <SelectItem value="failed">Ошибка</SelectItem>
          </SelectContent>
        </Select>

        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Фильтр
        </button>

        {(params.search || params.action || params.status) && (
          <a
            href="/admin/audit-log"
            className="px-4 py-2 rounded-md border text-sm hover:bg-muted transition-colors"
          >
            Сбросить
          </a>
        )}
      </form>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-40">Время</TableHead>
              <TableHead className="w-52">Пользователь</TableHead>
              <TableHead className="w-52">Действие</TableHead>
              <TableHead className="w-24">Статус</TableHead>
              <TableHead>Детали</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {logs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-12 text-sm"
                >
                  События не найдены
                </TableCell>
              </TableRow>
            )}

            {logs.map((log) => (
              <TableRow key={log.id} className="align-top">
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap pt-3">
                  {log.createdAt
                    ? dateFormatter.format(new Date(log.createdAt))
                    : "—"}
                </TableCell>

                <TableCell className="pt-3">
                  {log.user ? (
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        {log.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.user.email}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Удалённый пользователь
                    </span>
                  )}
                </TableCell>

                <TableCell className="pt-3">
                  <span
                    className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${actionBadgeClass(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                </TableCell>

                <TableCell className="pt-3">
                  <Badge
                    variant={log.success ? "default" : "destructive"}
                    className={
                      log.success
                        ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50"
                        : ""
                    }
                  >
                    {log.success ? "Успешно" : "Ошибка"}
                  </Badge>
                </TableCell>

                <TableCell className="pt-3">
                  <MetadataCell raw={log.metadata} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
