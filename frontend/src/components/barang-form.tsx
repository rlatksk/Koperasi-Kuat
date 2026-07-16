'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CreateBarangDto, UpdateBarangDto, Barang } from '@/types';
import { api } from '@/lib/api';
import { useToast } from '@/components/toast';

interface Props {
  barang?: Barang;
}

export default function BarangForm({ barang }: Props) {
  const router = useRouter();
  const { success, error } = useToast();
  const [form, setForm] = useState({
    nama_barang: barang?.nama_barang || '',
    sku: barang?.sku || '',
    satuan_pembelian: barang?.satuan_pembelian || '',
    satuan_penjualan: barang?.satuan_penjualan || '',
    konversi_satuan: barang?.konversi_satuan?.toString() || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data: CreateBarangDto = {
      nama_barang: form.nama_barang,
      sku: form.sku,
      satuan_pembelian: form.satuan_pembelian,
      satuan_penjualan: form.satuan_penjualan,
      konversi_satuan: parseFloat(form.konversi_satuan),
    };

    try {
      if (barang) {
        await api.barang.update(barang.id, data);
        success('Barang updated successfully');
      } else {
        await api.barang.create(data);
        success('Barang created successfully');
      }
      router.push('/barang');
      router.refresh();
    } catch (err: any) {
      error(err.message || 'Failed to save barang');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
        <input
          type="text"
          value={form.nama_barang}
          onChange={(e) => handleChange('nama_barang', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
        <input
          type="text"
          value={form.sku}
          onChange={(e) => handleChange('sku', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Satuan Pembelian</label>
        <input
          type="text"
          value={form.satuan_pembelian}
          onChange={(e) => handleChange('satuan_pembelian', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g. Drum"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Satuan Penjualan</label>
        <input
          type="text"
          value={form.satuan_penjualan}
          onChange={(e) => handleChange('satuan_penjualan', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g. Liter"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Konversi Satuan (1 {form.satuan_pembelian || 'Pembelian'} = ? {form.satuan_penjualan || 'Penjualan'})
        </label>
        <input
          type="number"
          value={form.konversi_satuan}
          onChange={(e) => handleChange('konversi_satuan', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="0.000001"
          step="any"
          placeholder="e.g. 200"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : barang ? 'Update Barang' : 'Create Barang'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/barang')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
