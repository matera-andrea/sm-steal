/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Item } from "@prisma/client";
import { Plus } from "lucide-react";
import {
  AddItemRow,
  ItemRowEdit,
  ItemRow,
  Pagination,
  BrandInfo,
} from "./itemTableComponents";

type ItemsResponse = {
  data: Item[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

// Componente principale
export default function ItemTable({
  initialData,
  brands,
}: {
  initialData?: ItemsResponse;
  brands: BrandInfo[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [items, setItems] = useState<Item[]>(initialData?.data || []);
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

  // Fetch items con paginazione
  const fetchItems = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/items?page=${page}&limit=${limit}`);

      if (!response.ok) throw new Error("Failed to fetch items");

      const data: ItemsResponse = await response.json();
      setItems(data.data);
      setPagination(data.pagination);
      setCurrentPage(data.pagination.page);
    } catch (error) {
      console.error("Error fetching items:", error);
      alert("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  // Carica items quando cambia pagina o page size
  useEffect(() => {
    if (!initialData) {
      fetchItems(currentPage, pageSize);
    }
  }, [currentPage, initialData, pageSize]);

  const handleAdd = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create item");

      await fetchItems(currentPage, pageSize);
      setIsAdding(false);
    } catch (error) {
      console.error("Error creating item:", error);
      alert("Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (itemId: string, data: Partial<Item>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update item");

      const updatedItem = await response.json();
      setItems(items.map((i) => (i.id === itemId ? updatedItem : i)));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete item");

      await fetchItems(currentPage, pageSize);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold leading-tight">Items</h2>
          <button
            onClick={() => setIsAdding(true)}
            disabled={isAdding || loading || brands?.length === 0}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>

        {brands?.length === 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 text-sm">
              No brands available. Please create a brand first before adding
              items.
            </p>
          </div>
        )}

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
            Showing {items.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
            {Math.min(currentPage * pageSize, pagination.total)} of{" "}
            {pagination.total} items
          </div>
        </div>

        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name / SKU
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Listings
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Wishlists
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
                  <AddItemRow
                    brands={brands}
                    onAdd={handleAdd}
                    onCancel={() => setIsAdding(false)}
                  />
                )}
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-8 text-center text-gray-500"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        Loading...
                      </div>
                    </td>
                  </tr>
                ) : items.length === 0 && !isAdding ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-8 text-center text-gray-500"
                    >
                      No items found. Click Add Item to create one.
                    </td>
                  </tr>
                ) : (
                  items.map((item) =>
                    editingId === item.id ? (
                      <ItemRowEdit
                        key={item.id}
                        item={item}
                        brands={brands}
                        onSave={(data) => handleUpdate(item.id, data)}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <ItemRow
                        key={item.id}
                        item={item}
                        itemBrandName={
                          brands.find((brand) => brand.id === item.brandId)
                            ?.name || "?"
                        }
                        onEdit={() => setEditingId(item.id)}
                        onDelete={() => handleDelete(item.id)}
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
