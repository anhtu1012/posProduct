/**
 * Frontend Helper Utilities for Advanced Filtering
 */

export type FilterOperator =
  | "eq" // Equal
  | "ne" // Not equal
  | "gt" // Greater than
  | "gte" // Greater than or equal
  | "lt" // Less than
  | "lte" // Less than or equal
  | "contains" // String contains
  | "startswith" // String starts with
  | "endswith" // String ends with
  | "in" // Value in array
  | "nin" // Value not in array
  | "regex" // Regex pattern
  | "exists"; // Field exists

export interface FilterItem {
  field: string;
  op: FilterOperator;
  value: string | number | boolean | string[];
}

/**
 * Build filter query string
 */
export function buildFilterQuery(filters: FilterItem[]): string {
  const params = new URLSearchParams();

  filters.forEach((filter, index) => {
    params.append(`filter[${index}][field]`, filter.field);
    params.append(`filter[${index}][op]`, filter.op);

    if (Array.isArray(filter.value)) {
      params.append(`filter[${index}][value]`, filter.value.join(","));
    } else {
      params.append(`filter[${index}][value]`, String(filter.value));
    }
  });

  return params.toString();
}

/**
 * Build complete API URL with filters
 */
export function buildApiUrl(
  baseUrl: string,
  options?: {
    filters?: FilterItem[];
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    select?: string;
    populate?: boolean;
    populateDepth?: number;
  },
): string {
  const params = new URLSearchParams();

  // Add filters
  if (options?.filters && options.filters.length > 0) {
    options.filters.forEach((filter, index) => {
      params.append(`filter[${index}][field]`, filter.field);
      params.append(`filter[${index}][op]`, filter.op);

      if (Array.isArray(filter.value)) {
        params.append(`filter[${index}][value]`, filter.value.join(","));
      } else {
        params.append(`filter[${index}][value]`, String(filter.value));
      }
    });
  }

  // Add pagination
  if (options?.page !== undefined) {
    params.append("page", String(options.page));
  }
  if (options?.limit !== undefined) {
    params.append("limit", String(options.limit));
  }

  // Add other options
  if (options?.search) params.append("search", options.search);
  if (options?.sort) params.append("sort", options.sort);
  if (options?.select) params.append("select", options.select);
  if (options?.populate !== undefined) {
    params.append("populate", String(options.populate));
  }
  if (options?.populateDepth !== undefined) {
    params.append("populateDepth", String(options.populateDepth));
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
