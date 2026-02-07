"use client";
import { useState, ReactNode, Dispatch, SetStateAction } from "react";
import { Plus, Loader2 } from "lucide-react";
import { DataRow, EditRow, Pagination } from "./DataTableComponents";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type ColumnDef<T> = {
  header: string;
  accessorKey: keyof T;
  renderCell?: (item: T) => ReactNode;
  renderEditCell?: (
    formData: Partial<T>,
    setFormData: Dispatch<SetStateAction<Partial<T>>>,
    className: string
  ) => ReactNode;
};

interface DataTableProps<T, F> {
  modelName: string;
  apiEndpoint: string;
  columns: ColumnDef<T>[];
  initialEmptyRow: Partial<T>;
  renderFilters?: (filters: F, setFilters: (f: F) => void) => ReactNode;
  initialFilters?: F;
}

export default function DataTable<
  T extends { id: string },
  F = Record<string, unknown>
>({
  modelName,
  apiEndpoint,
  columns,
  initialEmptyRow,
  renderFilters,
  initialFilters = {} as F,
}: DataTableProps<T, F>) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<F>(initialFilters);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: [apiEndpoint, page, filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(filters as Record<string, string>),
      });
      const res = await fetch(`${apiEndpoint}?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Network error");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id?: string;
      payload: Partial<T>;
    }) => {
      const method = id ? "PATCH" : "POST";
      const res = await fetch(id ? `${apiEndpoint}/${id}` : apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiEndpoint] });
      setEditingId(null);
      setIsAdding(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${apiEndpoint}/${id}`, { method: "DELETE" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [apiEndpoint] }),
  });

  const handleSetFilters = (newFilters: F) => {
    setFilters(newFilters);
    setPage(1);
  };

  const items = response?.data || [];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">
          {modelName}s <span className="text-amber-500">.</span>
        </h2>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {renderFilters && renderFilters(filters, handleSetFilters)}

          <button
            onClick={() => setIsAdding(true)}
            className="bg-black text-white px-6 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-amber-500 transition-all shadow-lg"
          >
            <Plus size={14} /> Add {modelName}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              {columns.map((col) => (
                <th
                  key={String(col.accessorKey)}
                  className="p-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100"
                >
                  {col.header}
                </th>
              ))}
              <th className="p-5 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && (
              <tr>
                <td colSpan={columns.length + 1} className="p-20 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-amber-500"
                    size={32}
                  />
                </td>
              </tr>
            )}

            {isAdding && (
              <EditRow
                item={initialEmptyRow}
                columns={columns}
                onSave={(payload) => mutation.mutate({ payload })}
                onCancel={() => setIsAdding(false)}
                isAdding={true}
              />
            )}

            {!isLoading &&
              items.map((item: T) =>
                editingId === item.id ? (
                  <EditRow
                    key={item.id}
                    item={item}
                    columns={columns}
                    onSave={(payload) =>
                      mutation.mutate({ id: item.id, payload })
                    }
                    onCancel={() => setEditingId(null)}
                    isAdding={false}
                  />
                ) : (
                  <DataRow
                    key={item.id}
                    item={item}
                    columns={columns}
                    onEdit={() => setEditingId(item.id)}
                    onDelete={() => deleteMutation.mutate(item.id)}
                  />
                )
              )}
          </tbody>
        </table>
      </div>

      {response?.pagination && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={response.pagination.totalPages}
            onPageChange={setPage}
            loading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
