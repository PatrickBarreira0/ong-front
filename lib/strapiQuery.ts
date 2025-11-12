import type { PaginationState, SortingState } from '@tanstack/react-table';
import qs from 'qs';

export interface StrapiListParams {
  pagination?: {
    page: number;
    pageSize: number;
  };
  sort?: string | string[];
  filters?: Record<string, any>;
  populate?: string[];
}

/**
 * Convert DataTable state to Strapi query parameters
 */
export function buildListParams({
  pagination,
  sorting,
  filters,
  populate = ['user', 'ong'],
}: {
  pagination: PaginationState;
  sorting: SortingState;
  filters?: Record<string, any>;
  populate?: string[];
}): StrapiListParams {
  // Build sort string: "field:asc" or "field:desc"
  const sortArray = sorting.map(
    (sort) => `${sort.id}:${sort.desc ? 'desc' : 'asc'}`
  );

  return {
    pagination: {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    },
    sort: sortArray.length > 0 ? sortArray : undefined,
    filters: filters || undefined,
    populate,
  };
}

/**
 * Convert params to query string for Strapi API
 * Uses qs to properly serialize nested objects
 */
export function stringifyParams(params: StrapiListParams): string {
  return qs.stringify(params, {
    encodeValuesOnly: true,
  });
}

