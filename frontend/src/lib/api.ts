const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}

export const api = {
  barang: {
    list: (params?: { search?: string; page?: number; limit?: number }) => {
      const qs = new URLSearchParams();
      if (params?.search) qs.set('search', params.search);
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      const query = qs.toString();
      return request<{ data: any[]; total: number }>(`/barang${query ? `?${query}` : ''}`);
    },
    get: (id: string) => request<any>(`/barang/${id}`),
    create: (data: any) =>
      request<any>('/barang', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request<any>(`/barang/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/barang/${id}`, { method: 'DELETE' }),
  },

  transaction: {
    list: (params?: { barang_id?: string; status?: string; tanggal_from?: string; tanggal_to?: string; page?: number; limit?: number }) => {
      const qs = new URLSearchParams();
      if (params?.barang_id) qs.set('barang_id', params.barang_id);
      if (params?.status) qs.set('status', params.status);
      if (params?.tanggal_from) qs.set('tanggal_from', params.tanggal_from);
      if (params?.tanggal_to) qs.set('tanggal_to', params.tanggal_to);
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      const query = qs.toString();
      return request<any>(`/transaction${query ? `?${query}` : ''}`);
    },
    create: (data: any) =>
      request<any>('/transaction', { method: 'POST', body: JSON.stringify(data) }),
    cancel: (id: string) =>
      request<any>(`/transaction/${id}/cancel`, { method: 'PATCH' }),
    sequencePreview: (tanggal: string) =>
      request<{ sequence: string }>(`/transaction/sequence-preview?tanggal=${tanggal}`),
  },
};
