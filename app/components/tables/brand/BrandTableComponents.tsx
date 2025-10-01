/* eslint-disable @typescript-eslint/no-explicit-any */

import { Brand } from "@prisma/client";
import { useState } from "react";
import Image from "next/image";
import {
  Edit2,
  Trash2,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Componente per la riga in modalità visualizzazione
export function BrandRow({
  brand,
  onEdit,
  onDelete,
}: {
  brand: Brand;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10">
            {brand.logoUrl ? (
              <Image
                className="w-full h-full rounded-full object-cover"
                src={brand.logoUrl}
                alt={brand.name}
                width={40}
                height={40}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                {brand.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap font-semibold">
              {brand.name}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900">{brand.description || "-"}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
        <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {brand.itemsCount}
        </span>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {new Date(brand.createdAt).toLocaleDateString()}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <span
          className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
            brand.isActive ? "text-green-900" : "text-red-900"
          }`}
        >
          <span
            aria-hidden
            className={`absolute inset-0 opacity-50 rounded-full ${
              brand.isActive ? "bg-green-200" : "bg-red-200"
            }`}
          ></span>
          <span className="relative">
            {brand.isActive ? "Active" : "Inactive"}
          </span>
        </span>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Componente per la riga in modalità edit
export function BrandRowEdit({
  brand,
  onSave,
  onCancel,
}: {
  brand: Brand;
  onSave: (data: Partial<Brand>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: brand.name,
    description: brand.description || "",
    logoUrl: brand.logoUrl || "",
    isActive: brand.isActive,
  });

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <tr className="bg-blue-50">
      <td className="px-5 py-5 border-b border-gray-200 text-sm">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Brand name"
        />
      </td>
      <td className="px-5 py-5 border-b border-gray-200 text-sm">
        <input
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Description"
        />
      </td>
      <td className="px-5 py-5 border-b border-gray-200 text-sm">
        <input
          type="text"
          value={formData.logoUrl}
          onChange={(e) =>
            setFormData({ ...formData, logoUrl: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Logo URL"
        />
      </td>
      <td className="px-5 py-5 border-b border-gray-200 text-sm">
        <p className="text-gray-500 text-xs">
          {new Date(brand.createdAt).toLocaleDateString()}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 text-sm">
        <select
          value={formData.isActive ? "true" : "false"}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.value === "true" })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            className="text-green-600 hover:text-green-800 transition-colors"
            title="Save"
          >
            <Save size={18} />
          </button>
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Componente per aggiungere un nuovo brand
export function AddBrandRow({
  onAdd,
  onCancel,
}: {
  onAdd: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    isActive: true,
  });

  const handleSubmit = () => {
    if (formData.name.trim()) {
      onAdd(formData);
    }
  };

  return (
    <tr className="bg-green-50">
      <td className="px-5 py-5 border-b border-gray-200 text-sm">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          placeholder="Brand name *"
          required
        />
      </td>
      <td className="px-5 py-5 border-b border-gray-200 text-sm">
        <input
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          placeholder="Description"
        />
      </td>
      <td className="px-5 py-5 border-b border-gray-200 text-sm">
        <input
          type="text"
          value={formData.logoUrl}
          onChange={(e) =>
            setFormData({ ...formData, logoUrl: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          placeholder="Logo URL"
        />
      </td>
      <td className="px-5 py-5 border-b border-gray-200 text-sm">
        <span className="text-gray-400 text-xs">New</span>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 text-sm">
        <select
          value={formData.isActive ? "true" : "false"}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.value === "true" })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={!formData.name.trim()}
            className="text-green-600 hover:text-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Save"
          >
            <Save size={18} />
          </button>
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Componente per la paginazione
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
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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
        className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            className={`px-3 py-1 rounded border transition-colors ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 hover:bg-gray-100"
            } disabled:cursor-not-allowed`}
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
        className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
