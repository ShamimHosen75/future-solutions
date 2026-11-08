"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type ColumnDef as TanColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DndContext, PointerSensor, KeyboardSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { ArrowUpDown, Copy, GripVertical, MoreHorizontal, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { deleteRecord, duplicateRecord, reorderRecords, toggleFlag } from "@/app/actions/content";
import { Switch } from "@/components/admin/ui/switch";
import { ConfirmDialog } from "@/components/admin/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/admin/ui/dropdown-menu";
import { useToast } from "@/components/admin/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { getModule, type ColumnDef } from "@/lib/admin/modules";
import { cn, formatDate } from "@/lib/utils";

type Row = Record<string, unknown> & { id: string; sort_order: number; is_published: boolean };

type DataTableProps = {
  moduleKey: string;
  rows: Row[];
};

function CellValue({ column, value }: { column: ColumnDef; value: unknown }) {
  switch (column.type) {
    case "image":
      return value ? (
        <span className="relative block size-9 overflow-hidden rounded-md bg-surface-2">
          <Image src={String(value)} alt="" fill sizes="36px" className="object-cover" />
        </span>
      ) : (
        <span className="block size-9 rounded-md bg-surface-2" />
      );
    case "badge":
      return value ? <Badge className="capitalize">{String(value).replace(/_/g, " ")}</Badge> : <span className="text-muted">—</span>;
    case "boolean":
      return value ? <Badge tone="cyan">Yes</Badge> : <span className="text-muted">—</span>;
    case "number":
      return <span className="tabular">{value === null || value === undefined || value === "" ? "—" : String(value)}</span>;
    case "currency":
      return <span className="tabular">{value === null || value === undefined ? "—" : `৳${Number(value).toLocaleString()}`}</span>;
    case "date":
      return <span className="tabular text-muted">{value ? formatDate(String(value)) : "—"}</span>;
    case "rating":
      return (
        <span className="inline-flex items-center gap-1 text-amber">
          <Star className="size-3.5 fill-amber" aria-hidden /> <span className="tabular text-silver">{String(value)}</span>
        </span>
      );
    default:
      return <span className="truncate">{value === null || value === undefined || value === "" ? <span className="text-muted">—</span> : String(value)}</span>;
  }
}

/** Generic admin list: search, publish filter, sortable columns, drag-and-drop ordering, row actions. */
export function DataTable({ moduleKey, rows: initialRows }: DataTableProps) {
  // Module definitions contain functions, so clients resolve them from the registry by key.
  const def = React.useMemo(() => getModule(moduleKey)!, [moduleKey]);
  const router = useRouter();
  const { toast } = useToast();
  const [rows, setRows] = React.useState<Row[]>(initialRows);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [status, setStatus] = React.useState<"all" | "published" | "draft">("all");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => setRows(initialRows), [initialRows]);

  const filtered = React.useMemo(
    () => (status === "all" ? rows : rows.filter((r) => (status === "published" ? r.is_published : !r.is_published))),
    [rows, status],
  );
  const canDrag = globalFilter === "" && status === "all" && sorting.length === 0;

  const run = React.useCallback(
    (fn: () => Promise<{ ok: boolean; message?: string }>, successTitle?: string) =>
      startTransition(async () => {
        const res = await fn();
        if (res.ok) {
          if (successTitle || res.message) toast({ title: successTitle ?? res.message ?? "Done" });
          router.refresh();
        } else {
          toast({ title: "Something went wrong", description: res.message, tone: "error" });
        }
      }),
    [router, toast],
  );

  const columns = React.useMemo<TanColumnDef<Row>[]>(() => {
    const defs: TanColumnDef<Row>[] = def.columns.map((col) => ({
      id: col.key,
      accessorFn: (row) => row[col.key],
      header: ({ column }) =>
        col.label ? (
          <button type="button" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="inline-flex items-center gap-1 hover:text-white">
            {col.label}
            <ArrowUpDown className="size-3 opacity-50" aria-hidden />
          </button>
        ) : null,
      cell: ({ getValue, row }) =>
        col.key === def.titleField ? (
          <Link href={`/admin/${def.key}/${row.original.id}`} data-no-transition className="font-medium text-white hover:text-cyan">
            {String(getValue() ?? "Untitled")}
          </Link>
        ) : (
          <CellValue column={col} value={getValue()} />
        ),
      enableSorting: Boolean(col.label),
      size: col.width ? parseFloat(col.width) * 16 : undefined,
    }));

    defs.push({
      id: "is_published",
      accessorFn: (row) => row.is_published,
      header: "Published",
      cell: ({ row }) => (
        <Switch
          checked={row.original.is_published}
          aria-label={`Toggle published for ${String(row.original[def.titleField] ?? "")}`}
          onCheckedChange={(v) => {
            setRows((rs) => rs.map((r) => (r.id === row.original.id ? { ...r, is_published: v } : r)));
            run(() => toggleFlag(def.key, row.original.id, "is_published", v), v ? "Published" : "Moved to drafts");
          }}
        />
      ),
      enableSorting: false,
    });

    for (const t of def.toggles) {
      defs.push({
        id: t.key,
        accessorFn: (row) => row[t.key],
        header: t.label,
        cell: ({ row }) => (
          <Switch
            checked={Boolean(row.original[t.key])}
            aria-label={`Toggle ${t.label}`}
            onCheckedChange={(v) => {
              setRows((rs) => rs.map((r) => (r.id === row.original.id ? { ...r, [t.key]: v } : r)));
              run(() => toggleFlag(def.key, row.original.id, t.key, v));
            }}
          />
        ),
        enableSorting: false,
      });
    }

    defs.push({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full p-2 text-muted hover:bg-white/5 hover:text-white" aria-label="Row actions">
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={`/admin/${def.key}/${row.original.id}`} data-no-transition><Pencil className="size-4" aria-hidden /> Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => run(() => duplicateRecord(def.key, row.original.id))}>
              <Copy className="size-4" aria-hidden /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={() => setConfirmId(row.original.id)}>
              <Trash2 className="size-4" aria-hidden /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      size: 48,
    });
    return defs;
  }, [def, run]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue).toLowerCase();
      return def.searchFields.some((f) => String(row.original[f] ?? "").toLowerCase().includes(q));
    },
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    const next = arrayMove(rows, oldIndex, newIndex).map((r, i) => ({ ...r, sort_order: i + 1 }));
    setRows(next);
    run(() => reorderRecords(def.key, next.map((r) => r.id)), "Order saved");
  };

  const visibleRows = table.getRowModel().rows;
  const confirmRow = rows.find((r) => r.id === confirmId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder={`Search ${def.label.toLowerCase()}…`} className="pl-10" aria-label="Search" />
        </div>
        <div className="w-full sm:w-44">
          <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </Select>
        </div>
        <Button href={`/admin/${def.key}/new`} data-no-transition>
          <Plus className="size-4" aria-hidden /> New {def.singular.toLowerCase()}
        </Button>
      </div>

      <div className={cn("overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface/40", pending && "opacity-80")}>
        <div className="no-scrollbar overflow-x-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-surface/60 text-left text-xs text-muted">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    <th className="w-10 px-3 py-3" aria-label="Reorder" />
                    {hg.headers.map((h) => (
                      <th key={h.id} className="px-3 py-3 font-medium" style={{ width: h.getSize() !== 150 ? h.getSize() : undefined }}>
                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <SortableContext items={visibleRows.map((r) => r.original.id)} strategy={verticalListSortingStrategy} disabled={!canDrag}>
                <tbody className="divide-y divide-border">
                  {visibleRows.map((row) => (
                    <SortableRow key={row.original.id} id={row.original.id} canDrag={canDrag}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="max-w-[20rem] px-3 py-2.5 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </SortableRow>
                  ))}
                  {visibleRows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-muted">
                        {rows.length === 0 ? `No ${def.label.toLowerCase()} yet. Create the first one.` : "Nothing matches your filters."}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted">
          <span>
            {visibleRows.length} of {rows.length} {def.label.toLowerCase()}
          </span>
          <span>{canDrag ? "Drag the handle to reorder" : "Clear search, filter and sorting to reorder"}</span>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmId)}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title={`Delete ${def.singular.toLowerCase()}?`}
        description={`“${String(confirmRow?.[def.titleField] ?? "")}” will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        pending={pending}
        onConfirm={() => {
          if (!confirmId) return;
          const id = confirmId;
          setConfirmId(null);
          setRows((rs) => rs.filter((r) => r.id !== id));
          run(() => deleteRecord(def.key, id));
        }}
      />
    </div>
  );
}

function SortableRow({ id, canDrag, children }: { id: string; canDrag: boolean; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !canDrag });
  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("bg-transparent hover:bg-white/[0.02]", isDragging && "relative z-10 bg-surface shadow-xl")}
    >
      <td className="px-3 py-2.5">
        <button
          type="button"
          className={cn("cursor-grab touch-none rounded p-1 text-muted hover:text-white active:cursor-grabbing", !canDrag && "cursor-not-allowed opacity-30")}
          aria-label="Drag to reorder"
          disabled={!canDrag}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </td>
      {children}
    </tr>
  );
}
