import { ChevronLeft, ChevronRight } from "lucide-react";

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export default function ShopPagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: ShopPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-24 flex justify-center items-center gap-8 border-t border-gray-100 pt-12 text-black">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || isLoading}
        className="group flex items-center gap-2 font-black text-xs uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />{" "}
        Prev
      </button>

      <span className="text-sm font-bold font-mono">
        {currentPage} <span className="text-gray-300 mx-2">/</span> {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || isLoading}
        className="group flex items-center gap-2 font-black text-xs uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next{" "}
        <ChevronRight
          size={18}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>
  );
}
