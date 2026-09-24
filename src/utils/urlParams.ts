/**
 * Validated Product Query State model
 */
export interface ProductQueryState {
  page: number;
  limit: 10 | 20 | 50;
  search: string;
  category: string;
  sortBy?: "price" | "rating" | "title";
  order?: "asc" | "desc";
}

export const ALLOWED_LIMITS = [10, 20, 50] as const;
export type AllowedLimit = (typeof ALLOWED_LIMITS)[number];

export const ALLOWED_SORT_BY = ["price", "rating", "title"] as const;
export type AllowedSortBy = (typeof ALLOWED_SORT_BY)[number];

export const ALLOWED_ORDERS = ["asc", "desc"] as const;
export type AllowedOrder = (typeof ALLOWED_ORDERS)[number];

export const DEFAULT_QUERY_STATE: ProductQueryState = {
  page: 1,
  limit: 10,
  search: "",
  category: "all",
};

/**
 * Converts URL search parameters into validated and normalized product-list state.
 * Any malformed, negative, non-numeric, or unexpected values automatically
 * fall back to safe defaults so corrupted or shared URLs never crash the application.
 */
export function parseProductQueryParams(
  searchParams: URLSearchParams | { [key: string]: string | string[] | undefined }
): ProductQueryState {
  const getParam = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) || undefined;
    }
    const val = searchParams[key];
    if (Array.isArray(val)) return val[0];
    return val;
  };

  // 1. Parse and validate page
  const rawPage = getParam("page");
  let parsedPage = rawPage ? parseInt(rawPage, 10) : 1;
  if (isNaN(parsedPage) || parsedPage < 1) {
    parsedPage = 1;
  }

  // 2. Parse and validate limit (must be 10, 20, or 50)
  const rawLimit = getParam("limit");
  const parsedLimit = rawLimit ? parseInt(rawLimit, 10) : 10;
  const limit: AllowedLimit = ALLOWED_LIMITS.includes(parsedLimit as AllowedLimit)
    ? (parsedLimit as AllowedLimit)
    : 10;

  // 3. Parse search
  const rawSearch = getParam("search");
  const search = rawSearch ? rawSearch.trim() : "";

  // 4. Parse category
  const rawCategory = getParam("category");
  const category = rawCategory && rawCategory.trim() ? rawCategory.trim() : "all";

  // 5. Parse and validate sortBy
  const rawSortBy = getParam("sortBy");
  const sortBy: AllowedSortBy | undefined =
    rawSortBy && ALLOWED_SORT_BY.includes(rawSortBy as AllowedSortBy)
      ? (rawSortBy as AllowedSortBy)
      : undefined;

  // 6. Parse and validate order
  const rawOrder = getParam("order");
  const order: AllowedOrder | undefined =
    rawOrder && ALLOWED_ORDERS.includes(rawOrder as AllowedOrder)
      ? (rawOrder as AllowedOrder)
      : undefined;

  return {
    page: parsedPage,
    limit,
    search,
    category,
    sortBy,
    order,
  };
}

/**
 * Serializes product query state into a URL query string.
 * Omits default values to keep the URL concise and clean.
 */
export function buildProductQueryString(state: Partial<ProductQueryState>): string {
  const params = new URLSearchParams();

  if (state.page && state.page > 1) {
    params.set("page", state.page.toString());
  }

  if (state.limit && state.limit !== 10) {
    params.set("limit", state.limit.toString());
  }

  if (state.search && state.search.trim()) {
    params.set("search", state.search.trim());
  }

  if (state.category && state.category !== "all") {
    params.set("category", state.category);
  }

  if (state.sortBy) {
    params.set("sortBy", state.sortBy);
    if (state.order) {
      params.set("order", state.order);
    }
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}
