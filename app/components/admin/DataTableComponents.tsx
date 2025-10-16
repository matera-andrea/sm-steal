// /components/ui/DataTableComponents.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Save,
  X,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, Fragment, ReactNode } from "react";
import { ColumnDef } from "./DataTable";
// Props comuni per le righe
interface RowProps<T> {
  item: T;
  columns: ColumnDef<T>[];
  onCancel: () => void;
}

// ==================================
//      RIGA IN MODALITÀ EDIT/ADD
// ==================================
interface EditRowProps<T> extends RowProps<T> {
  onSave: (data: Partial<T>) => void;
  isAdding: boolean;
}

export function EditRow<T, TForm>({
  item,
  columns,
  onSave,
  onCancel,
  isAdding,
}: {
  item: TForm; // L'item in modifica è del tipo del form
  columns: ColumnDef<T>[];
  onSave: (data: TForm) => void;
  onCancel: () => void;
  isAdding: boolean;
}) {
  const [formData, setFormData] = useState<TForm>(item);

  const handleSave = () => onSave(formData);

  const baseClasses =
    "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none";
  const focusClasses = isAdding
    ? "focus:border-green-500"
    : "focus:border-blue-500";

  return (
    <tr className={isAdding ? "bg-green-50" : "bg-blue-50"}>
      {columns.map((col, index) => (
        <td key={index} className="px-5 py-3 border-b border-gray-200 text-sm">
          {col.renderEditCell ? (
            // Passiamo il formData di tipo TForm e la sua funzione di aggiornamento
            col.renderEditCell(
              formData as any,
              setFormData as any,
              `${baseClasses} ${focusClasses}`
            )
          ) : (
            // Se non c'è un input di modifica, mostra un placeholder
            <span className="text-gray-500 text-xs">
              {col.renderCell ? col.renderCell(item as any) : "N/A"}
            </span>
          )}
        </td>
      ))}
      <td className="px-5 py-3 border-b border-gray-200 text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-800"
            title="Save"
          >
            <Save size={18} />
          </button>
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800"
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
// ==================================
//    RIGA IN MODALITÀ VISUALIZZAZIONE
// ==================================
interface DataRowProps<T> {
  item: T;
  columns: ColumnDef<T>[];
  onEdit: () => void;
  onDelete: () => void;
}

export function DataRow<T>({
  item,
  columns,
  onEdit,
  onDelete,
}: DataRowProps<T>) {
  return (
    <tr>
      {columns.map((col, index) => (
        <td
          key={index}
          className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
        >
          {col.renderCell
            ? col.renderCell(item)
            : (item as any)[col.accessorKey] || "-"}
        </td>
      ))}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ==================================
//          PAGINAZIONE
// ==================================
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}) {
  // ... (Il tuo codice di paginazione è già ottimo e rimane invariato)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        title="Previous page"
      >
        <ChevronLeft size={20} />
      </button>

      {getPageNumbers().map((page, idx) =>
        typeof page === "number" ? (
          <button
            key={idx}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`px-3 py-1 rounded border ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={idx} className="px-2">
            ...
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        title="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
