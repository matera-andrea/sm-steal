"use client";
import {
  Save,
  X,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ColumnDef } from "./DataTable";

// --- RIGA IN MODALITÀ EDIT/ADD ---
interface EditRowProps<T> {
  item: Partial<T>; // Può essere un item esistente o initialEmptyRow
  columns: ColumnDef<T>[];
  onSave: (data: Partial<T>) => void;
  onCancel: () => void;
  isAdding: boolean;
}

export function EditRow<T>({
  item,
  columns,
  onSave,
  onCancel,
  isAdding,
}: EditRowProps<T>) {
  // Inizializziamo lo stato con l'item passato (pieno o vuoto)
  const [formData, setFormData] = useState<Partial<T>>(item);

  // Se l'item cambia (es. passi da un edit a un altro), resettiamo il form
  useEffect(() => {
    setFormData(item);
  }, [item]);

  const baseClasses =
    "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none transition-colors";
  const focusClasses = isAdding
    ? "focus:border-green-500 bg-green-50/50"
    : "focus:border-blue-500 bg-blue-50/50";

  return (
    <tr className={isAdding ? "bg-green-50" : "bg-blue-50"}>
      {columns.map((col, index) => (
        <td key={index} className="px-5 py-3 border-b border-gray-200 text-sm">
          {col.renderEditCell ? (
            col.renderEditCell(
              formData,
              setFormData,
              `${baseClasses} ${focusClasses}`
            )
          ) : (
            <span className="text-gray-400 italic text-xs">
              Non modificabile
            </span>
          )}
        </td>
      ))}
      <td className="px-5 py-3 border-b border-gray-200 text-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSave(formData)}
            className="text-green-600 hover:text-green-800 transition-colors"
            title="Salva"
          >
            <Save size={20} />
          </button>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Annulla"
          >
            <X size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// --- RIGA IN MODALITÀ VISUALIZZAZIONE ---
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
    <tr className="hover:bg-gray-50 transition-colors">
      {columns.map((col, index) => (
        <td
          key={index}
          className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
        >
          {col.renderCell
            ? col.renderCell(item)
            : item[col.accessorKey]?.toString() || "-"}
        </td>
      ))}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Modifica"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => {
              if (confirm("Sei sicuro di voler eliminare questo elemento?")) {
                onDelete();
              }
            }}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Elimina"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// --- PAGINAZIONE ---
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
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      {getPageNumbers().map((page, idx) =>
        typeof page === "number" ? (
          <button
            key={idx}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`px-4 py-2 rounded border font-medium transition-all ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={idx} className="px-2 text-gray-400">
            ...
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
