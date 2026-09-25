export const ALLOWED_LIMITS = [10, 20, 50] as const;
export type AllowedLimit = (typeof ALLOWED_LIMITS)[number];
export type AllowedSortBy = "price" | "rating" | "title";
export type AllowedOrder = "asc" | "desc";

export interface ProductQueryState {
  page: number;
  limit: AllowedLimit;
  search: string;
  category: string;
  sortBy?: AllowedSortBy;
  order?: AllowedOrder;
}

/**
 * Parses URL search params into a validated ProductQueryState.
 */
export function parseProductQueryParams(
  params: URLSearchParams | { [key: string]: string | string[] | undefined }
): ProductQueryState {
  const get = (key: string): string => {
    if (params instanceof URLSearchParams) return params.get(key) || "";
    const val = params[key];
    return (Array.isArray(val) ? val[0] : val) || "";
  };

  const page = Math.max(1, parseInt(get("page"), 10) || 1);
  const rawLimit = parseInt(get("limit"), 10);
  const limit: AllowedLimit = [10, 20, 50].includes(rawLimit) ? (rawLimit as AllowedLimit) : 10;
  const search = get("search").trim();
  const category = get("category").trim() || "all";

  const rawSort = get("sortBy");
  const sortBy = ["price", "rating", "title"].includes(rawSort)
    ? (rawSort as AllowedSortBy)
    : undefined;

  const rawOrder = get("order");
  const order = sortBy && (rawOrder === "desc" || rawOrder === "asc")
    ? (rawOrder as AllowedOrder)
    : sortBy
    ? "asc"
    : undefined;

  return { page, limit, search, category, sortBy, order };
}

/**
 * Converts state back into a clean URL query string (omits defaults).
 */
export function buildProductQueryString(state: Partial<ProductQueryState>): string {
  const p = new URLSearchParams();

  if (state.page && state.page > 1) p.set("page", String(state.page));
  if (state.limit && state.limit !== 10) p.set("limit", String(state.limit));
  if (state.search?.trim()) p.set("search", state.search.trim());
  if (state.category && state.category !== "all") p.set("category", state.category);
  if (state.sortBy) {
    p.set("sortBy", state.sortBy);
    if (state.order) p.set("order", state.order);
  }

  const query = p.toString();
  return query ? `?${query}` : "";
}
