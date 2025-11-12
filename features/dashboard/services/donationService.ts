import { strapi, getStrapiToken } from '@/lib/strapiClient';
import type { StrapiListParams } from '@/lib/strapiQuery';

export interface DonationItem {
  id: string;
  Alimentos: string;
  quantity: string;
  expiration_date?: string;
  status_donation: 'Pendente' | 'Enviada' | 'Entregue';
  user?: {
    id: string;
    username: string;
    email: string;
  };
  ong?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StrapiDonation {
  id: string | number;
  documentId?: string;
  Alimentos: string | null;
  quantity: string;
  expiration_date?: string | null;
  status_donation: 'Pendente' | 'Enviada' | 'Entregue';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  user?: {
    id: string | number;
    username: string;
    email: string;
  } | null;
  ong?: {
    id: string | number;
    name: string;
    cnpj?: string;
    address?: string;
  } | null;
}

export interface StrapiListResponse {
  data: StrapiDonation[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Transform Strapi donation format to flat UI format
 */
export function transformDonation(strapiDonation: StrapiDonation): DonationItem {
  return {
    id: String(strapiDonation.id),
    Alimentos: strapiDonation.Alimentos || 'N/A',
    quantity: strapiDonation.quantity,
    expiration_date: strapiDonation.expiration_date || undefined,
    status_donation: strapiDonation.status_donation,
    user: strapiDonation.user
      ? {
          id: String(strapiDonation.user.id),
          username: strapiDonation.user.username,
          email: strapiDonation.user.email,
        }
      : undefined,
    ong: strapiDonation.ong
      ? {
          id: String(strapiDonation.ong.id),
          name: strapiDonation.ong.name,
        }
      : undefined,
    createdAt: strapiDonation.createdAt,
    updatedAt: strapiDonation.updatedAt,
  };
}

/**
 * List donations with pagination, sorting, and filtering
 */
export async function listDonations(
  params: StrapiListParams
): Promise<{ data: DonationItem[]; meta: StrapiListResponse['meta'] }> {
  try {
    // Build query parameters for Strapi API
    const queryParams = new URLSearchParams();
    
    if (params.pagination) {
      queryParams.append('pagination[page]', params.pagination.page.toString());
      queryParams.append('pagination[pageSize]', params.pagination.pageSize.toString());
    }
    
    if (params.sort) {
      const sortArray = Array.isArray(params.sort) ? params.sort : [params.sort];
      sortArray.forEach(s => queryParams.append('sort[]', s));
    }
    
    if (params.populate) {
      params.populate.forEach(p => queryParams.append('populate[]', p));
    }

    const response = await fetch(
      `${strapi.baseURL}/api/donations?${queryParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${getStrapiToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const json = (await response.json()) as StrapiListResponse;

    return {
      data: json.data.map(transformDonation),
      meta: json.meta,
    };
  } catch (error) {
    console.error('Error fetching donations from Strapi:', error);
    throw error;
  }
}

/**
 * Get a single donation by ID
 */
export async function getDonation(id: string | number) {
  try {
    const response = await fetch(
      `${strapi.baseURL}/api/donations/${id}?populate[]=user&populate[]=ong`,
      {
        headers: {
          'Authorization': `Bearer ${getStrapiToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const json = (await response.json()) as { data: StrapiDonation };
    return transformDonation(json.data);
  } catch (error) {
    console.error('Error fetching donation from Strapi:', error);
    throw error;
  }
}

/**
 * Create a new donation
 */
export async function createDonation(data: Partial<DonationItem>) {
  try {
    const response = await fetch(
      `${strapi.baseURL}/api/donations`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getStrapiToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const json = (await response.json()) as { data: StrapiDonation };
    return transformDonation(json.data);
  } catch (error) {
    console.error('Error creating donation in Strapi:', error);
    throw error;
  }
}

/**
 * Update a donation
 */
export async function updateDonation(
  id: string | number,
  data: Partial<DonationItem>
) {
  try {
    const response = await fetch(
      `${strapi.baseURL}/api/donations/${id}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getStrapiToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const json = (await response.json()) as { data: StrapiDonation };
    return transformDonation(json.data);
  } catch (error) {
    console.error('Error updating donation in Strapi:', error);
    throw error;
  }
}

/**
 * Delete a donation
 */
export async function deleteDonation(id: string | number) {
  try {
    const response = await fetch(
      `${strapi.baseURL}/api/donations/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getStrapiToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting donation in Strapi:', error);
    throw error;
  }
}

