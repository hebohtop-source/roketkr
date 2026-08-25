"use client"

import { useState, useTransition, useRef, useCallback, useId } from "react"
import { Trash2, ChevronUp, ChevronDown, ChevronsUpDown, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow, TableFooter,
} from "@/components/ui/table"

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

export type TextColumnDef<TRow> = {
  type: "text"
  key: string
  header: string
  accessor: (row: TRow) => string | number | null | undefined
  sortable?: boolean
}

export type EditableColumnDef<TRow> = {
  type: "editable"
  key: string
  header: string
  accessor: (row: TRow) => string | number | null | undefined
  inputType?: "text" | "number" | "email" | "url"
  onSave: (row: TRow, newValue: string) => Promise<void> | void
  sortable?: boolean
}

export type BooleanColumnDef<TRow> = {
  type: "boolean"
  key: string
  header: string
  accessor: (row: TRow) => boolean
  labels?: { true: string; false: string }
  onToggle: (row: TRow, newValue: boolean) => Promise<void> | void
  sortable?: boolean
}

export type BadgeColumnDef<TRow> = {
  type: "badge"
  key: string
  header: string
  accessor: (row: TRow) => string
  variant: (row: TRow) => "default" | "secondary" | "destructive" | "outline"
  className?: (row: TRow) => string
  sortable?: boolean
}

export type CustomColumnDef<TRow> = {
  type: "custom"
  key: string
  header: string
  render: (row: TRow) => React.ReactNode
  sortAccessor?: (row: TRow) => string | number
  sortable?: boolean
}

export type ColumnDef<TRow> =
  | TextColumnDef<TRow>
  | EditableColumnDef<TRow>
  | BooleanColumnDef<TRow>
  | BadgeColumnDef<TRow>
  | CustomColumnDef<TRow>

// ---------------------------------------------------------------------------
// Selection — controlled vs uncontrolled
// ---------------------------------------------------------------------------

type UncontrolledSelection = {
  selectedRows?: undefined
  onSelectionChange?: (selected: ReadonlySet<string>) => void
}

type ControlledSelection = {
  selectedRows: ReadonlySet<string>
  onSelectionChange: (selected: ReadonlySet<string>) => void
}

type SelectionProps = UncontrolledSelection | ControlledSelection

// ---------------------------------------------------------------------------
// Table props
// ---------------------------------------------------------------------------

export type DataTableProps<TRow extends { id: string }> = SelectionProps & {
  rows: TRow[]
  columns: ColumnDef<TRow>[]
  onBulkDeleteAction?: (ids: string[]) => Promise<void> | void
  className?: string
  tableHeight?: string
  footerExtra?: React.ReactNode
}

// ---------------------------------------------------------------------------
// Sort state
// ---------------------------------------------------------------------------

type SortDirection = "asc" | "desc" | null
type SortState = { key: string; direction: SortDirection }

// ---------------------------------------------------------------------------
// Editable cell
// Fixed-height container. Text label is always rendered. Input overlays it
// as an absolute layer so the row height never shifts on edit.
// ---------------------------------------------------------------------------

function EditableCell<TRow>({
  row,
  col,
}: {
  row: TRow
  col: EditableColumnDef<TRow>
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const displayValue = col.accessor(row)

  const startEditing = () => {
    setValue(String(displayValue ?? ""))
    setEditing(true)
    // rAF so the input is in the DOM before we focus
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }

  const cancel = () => setEditing(false)

  const save = async () => {
    setSaving(true)
    try {
      await col.onSave(row, value)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    // Fixed height so the row never reflows. Input is absolute inside this box.
    <div className="relative h-8 flex items-center min-w-[120px]">
      {/* ── Read layer ── always mounted so column width stays stable */}
      <button
        type="button"
        onClick={startEditing}
        aria-label={`Редактировать ${col.header}`}
        className={[
          "group flex items-center gap-1.5 w-full h-full rounded px-1",
          "text-left text-sm transition-opacity duration-150",
          "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          editing || saving ? "opacity-0 pointer-events-none" : "opacity-100",
        ].join(" ")}
      >
        <span className="flex-1 overflow-hidden">
          {displayValue !== null && displayValue !== undefined
            ? displayValue
            : <span className="text-muted-foreground italic">—</span>}
        </span>
        <Pencil className="w-3 h-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* ── Edit layer ── absolute overlay, visible only while editing/saving */}
      <div
        className={[
          "absolute inset-0 flex items-center gap-1",
          "transition-opacity duration-150",
          editing || saving ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <Input
          id={inputId}
          ref={inputRef}
          type={col.inputType ?? "text"}
          value={value}
          disabled={saving}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save()
            if (e.key === "Escape") cancel()
          }}
          onBlur={cancel}
          className="h-7 flex-1 min-w-0 text-sm px-2 py-0"
        />
        <button
          type="button"
          onMouseDown={(e) => {
            // Prevent the input's onBlur from firing before this click lands
            e.preventDefault()
            save()
          }}
          disabled={saving}
          className="h-7 w-7 shrink-0 flex items-center justify-center rounded text-xs bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          aria-label="Сохранить"
        >
          {saving ? "…" : "✓"}
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            cancel()
          }}
          disabled={saving}
          className="h-7 w-7 shrink-0 flex items-center justify-center rounded text-xs hover:bg-muted disabled:opacity-50 transition-colors"
          aria-label="Отмена"
        >
          ✕
        </button>
      </div>

      {/* ── Saving spinner — shown instead of either layer while pending ── */}
      {saving && (
        <div className="absolute inset-0 flex items-center px-1">
          <span className="text-sm text-muted-foreground animate-pulse">Сохранение…</span>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Boolean cell
// Fixed-height, label width reserved so the row never shifts on toggle.
// ---------------------------------------------------------------------------

function BooleanCell<TRow>({
  row,
  col,
}: {
  row: TRow
  col: BooleanColumnDef<TRow>
}) {
  const [toggling, setToggling] = useState(false)
  const value = col.accessor(row)
  const labels = col.labels ?? { true: "Да", false: "Нет" }

  const handleToggle = async (checked: boolean) => {
    setToggling(true)
    try {
      await col.onToggle(row, checked)
    } finally {
      setToggling(false)
    }
  }

  return (
    // min-w keeps both label states at the same width so columns don't jump
    <div className="flex items-center gap-2 h-8 min-w-[5.5rem]">
      <Switch
        checked={value}
        onCheckedChange={handleToggle}
        disabled={toggling}
        aria-label={col.header}
        className={toggling ? "opacity-50 transition-opacity" : "transition-opacity"}
      />
      {/* Fixed-width label container so "Да" and "Нет" don't shift layout */}
      <span className="w-6 text-sm text-muted-foreground transition-opacity duration-150 select-none"
        style={{ opacity: toggling ? 0.4 : 1 }}>
        {value ? labels.true : labels.false}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sort helpers
// ---------------------------------------------------------------------------

function getSortValue<TRow>(row: TRow, col: ColumnDef<TRow>): string | number {
  if (col.type === "custom") return col.sortAccessor?.(row) ?? ""
  if (col.type === "boolean") return col.accessor(row) ? 1 : 0
  return col.accessor(row) ?? ""
}

function applySorting<TRow>(
  rows: TRow[],
  sort: SortState | null,
  columns: ColumnDef<TRow>[],
): TRow[] {
  if (!sort || sort.direction === null) return rows
  const col = columns.find((c) => c.key === sort.key)
  if (!col) return rows
  return [...rows].sort((a, b) => {
    const av = getSortValue(a, col)
    const bv = getSortValue(b, col)
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sort.direction === "asc" ? cmp : -cmp
  })
}

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === "asc") return <ChevronUp className="w-3 h-3 ml-1 inline-block" />
  if (direction === "desc") return <ChevronDown className="w-3 h-3 ml-1 inline-block" />
  return <ChevronsUpDown className="w-3 h-3 ml-1 inline-block opacity-40" />
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DataTable<TRow extends { id: string }>({
  rows,
  columns,
  onBulkDeleteAction,
  className,
  tableHeight = "70vh",
  footerExtra,
  selectedRows: controlledSelected,
  onSelectionChange,
}: DataTableProps<TRow>) {
  const [internalSelected, setInternalSelected] = useState<ReadonlySet<string>>(new Set())

  const isControlled = controlledSelected !== undefined
  const selected: ReadonlySet<string> = isControlled ? controlledSelected : internalSelected

  const applySelection = useCallback(
    (next: ReadonlySet<string>) => {
      if (isControlled) {
        onSelectionChange?.(next)
      } else {
        setInternalSelected(next)
        onSelectionChange?.(next)
      }
    },
    [isControlled, onSelectionChange],
  )

  const [isPending, startTransition] = useTransition()
  const [sort, setSort] = useState<SortState | null>(null)
  const lastClickedIndex = useRef<number | null>(null)
  const sortedRows = applySorting(rows, sort, columns)

  const allChecked = rows.length > 0 && selected.size === rows.length
  const indeterminate = selected.size > 0 && !allChecked
  const hasSelection = onBulkDeleteAction !== undefined

  const toggleAll = useCallback(() => {
    applySelection(allChecked ? new Set() : new Set(rows.map((r) => r.id)))
  }, [allChecked, rows, applySelection])

  const toggleOne = useCallback(
    (id: string, rowIndex: number, shiftHeld: boolean) => {
      const next = new Set(selected)
      if (shiftHeld && lastClickedIndex.current !== null) {
        const from = Math.min(lastClickedIndex.current, rowIndex)
        const to = Math.max(lastClickedIndex.current, rowIndex)
        const rangeIds = sortedRows.slice(from, to + 1).map((r) => r.id)
        const adding = !selected.has(id)
        rangeIds.forEach((rid) => (adding ? next.add(rid) : next.delete(rid)))
      } else {
        next.has(id) ? next.delete(id) : next.add(id)
      }
      applySelection(next)
      if (!shiftHeld) lastClickedIndex.current = rowIndex
    },
    [selected, sortedRows, applySelection],
  )

  const handleBulkDelete = useCallback(() => {
    if (!onBulkDeleteAction) return
    if (!confirm(`Удалить ${selected.size} запись(-ей)? Это действие необратимо.`)) return
    startTransition(async () => {
      await onBulkDeleteAction(Array.from(selected))
      applySelection(new Set())
    })
  }, [onBulkDeleteAction, selected, applySelection])

  const handleSort = useCallback((key: string) => {
    setSort((prev) => {
      if (prev?.key !== key) return { key, direction: "asc" }
      if (prev.direction === "asc") return { key, direction: "desc" }
      return null
    })
  }, [])

  const renderCell = (row: TRow, col: ColumnDef<TRow>) => {
    switch (col.type) {
      case "text":
        return <span className="text-sm">{col.accessor(row) ?? <span className="text-muted-foreground italic">—</span>}</span>
      case "editable":
        return <EditableCell row={row} col={col} />
      case "boolean":
        return <BooleanCell row={row} col={col} />
      case "badge":
        return (
          <Badge variant={col.variant(row)} className={col.className?.(row)}>
            {col.accessor(row)}
          </Badge>
        )
      case "custom":
        return <>{col.render(row)}</>
    }
  }

  const extraColCount = hasSelection ? 1 : 0

  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      {/* Bulk action bar */}
      {hasSelection && (
        <div
          className={[
            "flex items-center gap-3 px-4 py-2 rounded-lg border bg-muted",
            "transition-all duration-200",
            selected.size > 0 ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <span className="text-sm text-muted-foreground">
            Выбрано: <strong>{selected.size}</strong>
          </span>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2 ml-auto"
            onClick={handleBulkDelete}
            disabled={isPending}
          >
            <Trash2 className="w-4 h-4" />
            {isPending ? "Удаление…" : "Удалить выбранные"}
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border overflow-auto" style={{ height: tableHeight }}>
        <Table>
          <TableHeader>
            <TableRow>
              {hasSelection && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={allChecked}
                    data-state={indeterminate ? "indeterminate" : allChecked ? "checked" : "unchecked"}
                    onCheckedChange={toggleAll}
                    aria-label="Выбрать все"
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead key={col.key}>
                  {col.sortable ? (
                    <button
                      type="button"
                      className="flex items-center font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.header}
                      <SortIcon direction={sort?.key === col.key ? sort.direction : null} />
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + extraColCount}
                  className="text-center text-muted-foreground py-10"
                >
                  Нет данных
                </TableCell>
              </TableRow>
            ) : (
              sortedRows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={selected.has(row.id) ? "selected" : undefined}
                >
                  {hasSelection && (
                    <TableCell className="w-px whitespace-nowrap">
                      <Checkbox
                        checked={selected.has(row.id)}
                        onCheckedChange={() => { }}
                        onClick={(e: React.MouseEvent) => toggleOne(row.id, rowIndex, e.shiftKey)}

                        aria-label={`Выбрать строку ${row.id}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key}>{renderCell(row, col)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={columns.length + extraColCount}
                className="text-muted-foreground text-sm"
              >
                <div className="flex items-center justify-between">
                  <span>{rows.length} записей</span>
                  {footerExtra}
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
