  // /components/ui/DataTable.tsx

  /* eslint-disable @typescript-eslint/no-explicit-any */
  "use client";
  import {
    useState,
    useEffect,
    ReactNode,
    Dispatch,
    SetStateAction,
  } from "react";
  import { Plus } from "lucide-react";
  import { DataRow, EditRow, Pagination } from "./DataTableComponents";

  // ==================================
  //              TIPI
  // ==================================
  type PaginatedResponse<T> = {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };

  // Definizione della colonna: il cuore della nostra astrazione
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

  // Props del componente DataTable
  interface DataTableProps<T> {
    modelName: string; // Es. "Brand", "Item"
    apiEndpoint: string; // Es. "/api/brands"
    columns: ColumnDef<T>[];
    initialData?: PaginatedResponse<T>;
    initialEmptyRow: Partial<T>; // Oggetto vuoto per la riga "Aggiungi"
  }

  // ==================================
  //        COMPONENTE PRINCIPALE
  // ==================================
  export default function DataTable<T extends { id: string }>({
    modelName,
    apiEndpoint,
    columns,
    initialData,
    initialEmptyRow,
  }: DataTableProps<T>) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [data, setData] = useState<T[]>(initialData?.data || []);
    const [pagination, setPagination] = useState(
      initialData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }
    );
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Fetch dei dati
    const fetchData = async (page: number, limit: number) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiEndpoint}?page=${page}&limit=${limit}`
        );
        if (!response.ok) throw new Error(`Failed to fetch ${modelName}s`);
        const result: PaginatedResponse<T> = await response.json();
        setData(result.data);
        setPagination(result.pagination);
        setCurrentPage(result.pagination.page);
      } catch (error) {
        console.error(`Error fetching ${modelName}s:`, error);
        alert(`Failed to load ${modelName}s`);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (!initialData) {
        fetchData(currentPage, pageSize);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize, initialData]);

    const handleApiCall = async (
      endpoint: string,
      method: "POST" | "PATCH" | "DELETE",
      body?: any
    ) => {
      setLoading(true);
      try {
        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || `Failed to ${method} ${modelName}`);
        }
        return response;
      } catch (error) {
        console.error(`Error with ${method} ${modelName}:`, error);
        alert((error as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    };

    const handleAdd = async (newData: Partial<T>) => {
      const response = await handleApiCall(apiEndpoint, "POST", newData);
      if (response) {
        setIsAdding(false);
        fetchData(1, pageSize); // Torna alla prima pagina per vedere il nuovo elemento
      }
    };

    const handleUpdate = async (id: string, updatedData: Partial<T>) => {
      const response = await handleApiCall(
        `${apiEndpoint}/${id}`,
        "PATCH",
        updatedData
      );
      if (response) {
        const updatedItem = await response.json();
        setData(data.map((item) => (item.id === id ? updatedItem : item)));
        setEditingId(null);
      }
    };

    const handleDelete = async (id: string) => {
      if (!confirm(`Are you sure you want to delete this ${modelName}?`)) return;
      const response = await handleApiCall(`${apiEndpoint}/${id}`, "DELETE");
      if (response) {
        fetchData(currentPage, pageSize); // Ricarica la pagina
      }
    };

    const handlePageChange = (page: number) => setCurrentPage(page);
    const handlePageSizeChange = (newSize: number) => {
      setPageSize(newSize);
      setCurrentPage(1);
    };

    const startEditing = (id: string) => {
      setIsAdding(false);
      setEditingId(id);
    };
    const startAdding = () => {
      setEditingId(null);
      setIsAdding(true);
    };

    return (
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold leading-tight">{modelName}s</h2>
            <button
              onClick={startAdding}
              disabled={isAdding || loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              <Plus size={20} /> Add {modelName}
            </button>
          </div>

          {/* Controlli e Info Paginazione */}
          <div className="mb-4 flex items-center gap-4">
            {/* ... il tuo JSX per i controlli di paginazione va qui ... */}
          </div>

          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={String(col.accessorKey)}
                        className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase"
                      >
                        {col.header}
                      </th>
                    ))}
                    <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isAdding && (
                    <EditRow
                      key="add-row"
                      item={initialEmptyRow as T}
                      columns={columns}
                      onSave={handleAdd}
                      onCancel={() => setIsAdding(false)}
                      isAdding={true}
                    />
                  )}
                  {loading && data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="text-center py-8"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : !loading && data.length === 0 && !isAdding ? (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="text-center py-8"
                      >
                        No {modelName}s found.
                      </td>
                    </tr>
                  ) : (
                    data.map((item) =>
                      editingId === item.id ? (
                        <EditRow
                          key={item.id}
                          item={item}
                          columns={columns}
                          onSave={(updatedData) =>
                            handleUpdate(item.id, updatedData)
                          }
                          onCancel={() => setEditingId(null)}
                          isAdding={false}
                        />
                      ) : (
                        <DataRow
                          key={item.id}
                          item={item}
                          columns={columns}
                          onEdit={() => startEditing(item.id)}
                          onDelete={() => handleDelete(item.id)}
                        />
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
