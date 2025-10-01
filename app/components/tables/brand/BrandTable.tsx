/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Brand } from "@prisma/client";
import {
  AddBrandRow,
  BrandRowEdit,
  BrandRow,
  Pagination,
} from "./BrandTableComponents";

type BrandsResponse = {
  data: Brand[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

// Componente principale
export default function BrandTable({
  initialData,
}: {
  initialData?: BrandsResponse;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [brands, setBrands] = useState<Brand[]>(initialData?.data || []);
  const [pagination, setPagination] = useState(
    initialData?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      pages: 1,
    }
  );
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch brands con paginazione
  const fetchBrands = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/brands?page=${page}&limit=${limit}`);

      if (!response.ok) throw new Error("Failed to fetch brands");

      const data: BrandsResponse = await response.json();
      setBrands(data.data);
      setPagination(data.pagination);
      setCurrentPage(data.pagination.page);
    } catch (error) {
      console.error("Error fetching brands:", error);
      alert("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  // Carica brands quando cambia pagina o page size
  useEffect(() => {
    if (!initialData) {
      fetchBrands(currentPage, pageSize);
    }
  }, [currentPage, initialData, pageSize]);

  const handleAdd = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create brand");

      await fetchBrands(currentPage, pageSize); // Ricarica la pagina corrente
      setIsAdding(false);
    } catch (error) {
      console.error("Error creating brand:", error);
      alert("Failed to create brand");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (brandId: string, data: Partial<Brand>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update brand");

      const updatedBrand = await response.json();
      setBrands(brands.map((b) => (b.id === brandId ? updatedBrand : b)));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating brand:", error);
      alert("Failed to update brand");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (brandId: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete brand");

      await fetchBrands(currentPage, pageSize); // Ricarica la pagina corrente
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Failed to delete brand");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset alla prima pagina
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold leading-tight">Brands</h2>
          <button
            onClick={() => setIsAdding(true)}
            disabled={isAdding || loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            Add Brand
          </button>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Show:</label>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              disabled={loading}
              className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          <div className="text-sm text-gray-600">
            Showing {brands.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}{" "}
            to {Math.min(currentPage * pageSize, pagination.total)} of{" "}
            {pagination.total} brands
          </div>
        </div>

        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isAdding && (
                  <AddBrandRow
                    onAdd={handleAdd}
                    onCancel={() => setIsAdding(false)}
                  />
                )}
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-gray-500"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        Loading...
                      </div>
                    </td>
                  </tr>
                ) : brands.length === 0 && !isAdding ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-gray-500"
                    >
                      No brands found. Click Add Brand to create one.
                    </td>
                  </tr>
                ) : (
                  brands.map((brand) =>
                    editingId === brand.id ? (
                      <BrandRowEdit
                        key={brand.id}
                        brand={brand}
                        onSave={(data) => handleUpdate(brand.id, data)}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <BrandRow
                        key={brand.id}
                        brand={brand}
                        onEdit={() => setEditingId(brand.id)}
                        onDelete={() => handleDelete(brand.id)}
                      />
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pagination.pages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
