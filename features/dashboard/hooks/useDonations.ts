import { useQuery } from '@tanstack/react-query';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { listDonations, type DonationItem } from '../services/donationService';
import { buildListParams } from '@/lib/strapiQuery';

interface UseDonationsOptions {
  pagination: PaginationState;
  sorting: SortingState;
  filters?: Record<string, any>;
  enabled?: boolean;
}

export function useDonations({
  pagination,
  sorting,
  filters,
  enabled = true,
}: UseDonationsOptions) {
  return useQuery({
    queryKey: ['donations', pagination, sorting, filters],
    queryFn: async () => {
      const params = buildListParams({
        pagination,
        sorting,
        filters,
        populate: ['user', 'ong'],
      });
      return listDonations(params);
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch donations filtered by ONG ID (for ONG dashboard)
 */
export function useDonationsByOng({
  ongId,
  pagination,
  sorting,
  enabled = true,
}: {
  ongId: string | number;
  pagination: PaginationState;
  sorting: SortingState;
  enabled?: boolean;
}) {
  return useDonations({
    pagination,
    sorting,
    filters: {
      ong: {
        id: {
          $eq: ongId,
        },
      },
    },
    enabled,
  });
}

/**
 * Hook to fetch donations filtered by user ID (for donor dashboard)
 */
export function useDonationsByUser({
  userId,
  pagination,
  sorting,
  enabled = true,
}: {
  userId: string | number;
  pagination: PaginationState;
  sorting: SortingState;
  enabled?: boolean;
}) {
  return useDonations({
    pagination,
    sorting,
    filters: {
      user: {
        id: {
          $eq: userId,
        },
      },
    },
    enabled,
  });
}

