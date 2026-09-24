/**
 * Pagination helper calculations
 */

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  skip: number;
  startItem: number;
  endItem: number;
  hasPrev: boolean;
  hasNext: boolean;
  pageNumbers: (number | "ellipsis")[];
}

/**
 * Calculates zero-based skip offset for pagination APIs.
 */
export function calculateSkip(page: number, limit: number): number {
  const safePage = Math.max(1, page);
  return (safePage - 1) * limit;
}

/**
 * Computes complete pagination details including dynamic page number sequence
 * with smart ellipsis for high page counts.
 */
export function getPaginationInfo(total: number, page: number, limit: number): PaginationInfo {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const skip = calculateSkip(safePage, limit);

  const startItem = total === 0 ? 0 : skip + 1;
  const endItem = Math.min(skip + limit, total);

  const hasPrev = safePage > 1;
  const hasNext = safePage < totalPages;

  // Build page numbers array with ellipsis
  const pageNumbers: (number | "ellipsis")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);

    if (safePage > 3) {
      pageNumbers.push("ellipsis");
    }

    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (safePage < totalPages - 2) {
      pageNumbers.push("ellipsis");
    }

    pageNumbers.push(totalPages);
  }

  return {
    total,
    page: safePage,
    limit,
    totalPages,
    skip,
    startItem,
    endItem,
    hasPrev,
    hasNext,
    pageNumbers,
  };
}
