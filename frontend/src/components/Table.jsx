import { ChevronUp, ChevronDown, Inbox } from "lucide-react";
import { useIsMobile } from "../utils/useIsMobile";
import Skeleton from "./Skeleton";

export const Table = ({
  headers = [],
  data = [],
  loading = false,
  emptyMessage = "No entries found.",
  sortKey = "",
  sortOrder = "asc",
  onSort = () => {},
  renderRow = () => null,
  renderCard = () => null,
  className = "",
}) => {
  const isMobile = useIsMobile();

  const handleHeaderClick = (header) => {
    if (!header.sortable) return;
    const newOrder = sortKey === header.key && sortOrder === "asc" ? "desc" : "asc";
    onSort(header.key, newOrder);
  };

  // Rendering Loading Skeleton Screen
  if (loading) {
    return (
      <div className="space-y-3 w-full">
        {isMobile ? (
          // Mobile Skeleton Card Stacks
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface rounded-2xl border border-border p-5 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <Skeleton width="w-24" height="h-4" />
                <Skeleton width="w-16" height="h-5" />
              </div>
              <Skeleton width="w-full" height="h-6" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton width="w-20" height="h-4" />
                <Skeleton width="w-16" height="h-8" />
              </div>
            </div>
          ))
        ) : (
          // Desktop Skeleton Table Rows
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="border-b border-border px-6 py-4 bg-surface-muted flex gap-4">
              {headers.map((h, i) => (
                <Skeleton key={i} width="w-1/4" height="h-4" />
              ))}
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4 border-b border-border last:border-0 items-center">
                {headers.map((_, j) => (
                  <Skeleton key={j} width="w-1/4" height="h-5" />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Rendering Empty State Screen
  if (data.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center animate-fade-in w-full">
        <div className="w-16 h-16 rounded-2xl bg-surface-muted flex items-center justify-center text-text-secondary/50 mb-4 border border-border">
          <Inbox size={26} />
        </div>
        <h4 className="text-lg font-serif font-bold text-text-primary leading-tight">
          No records found
        </h4>
        <p className="text-sm text-text-secondary mt-1 leading-relaxed max-w-sm">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // Rendering Mobile Card Stacks
  if (isMobile) {
    return (
      <div className={`flex flex-col gap-4 w-full animate-fade-in ${className}`}>
        {data.map((row, index) => renderCard(row, index))}
      </div>
    );
  }

  // Rendering Desktop Table Layout
  return (
    <div className={`bg-surface border border-border rounded-2xl overflow-hidden shadow-sm animate-fade-in w-full ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-muted border-b border-border">
              {headers.map((header) => {
                const isSorted = sortKey === header.key;
                return (
                  <th
                    key={header.key}
                    onClick={() => handleHeaderClick(header)}
                    className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary select-none
                      ${header.sortable ? "cursor-pointer hover:text-text-primary transition-colors" : ""}
                    `}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{header.label}</span>
                      {header.sortable && isSorted && (
                        sortOrder === "asc" ? (
                          <ChevronUp size={14} className="text-accent shrink-0" />
                        ) : (
                          <ChevronDown size={14} className="text-accent shrink-0" />
                        )
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {data.map((row, index) => renderRow(row, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
