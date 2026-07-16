'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';
import { Barang } from '@/types';
import { api } from '@/lib/api';
import { useToast } from '@/components/toast';
import DataTable, { Column } from '@/components/data-table';
import ConfirmDialog from '@/components/confirm-dialog';

export default function BarangPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [barang, setBarang] = useState<Barang[]>([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await api.barang.list(search || undefined);
      setBarang(data);
    } catch (err: any) {
      error(err.message);
    }
  }, [search, error]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.barang.delete(deleteId);
      success('Barang deleted');
      setDeleteId(null);
      fetchData();
    } catch (err: any) {
      error(err.message);
    }
  };

  const columns: Column<Barang>[] = [
    { key: 'nama_barang', header: 'Nama Barang', render: (b) => b.nama_barang, sortable: true },
    { key: 'sku', header: 'SKU', render: (b) => <span className="font-mono text-xs">{b.sku}</span>, sortable: true },
    { key: 'satuan_pembelian', header: 'Satuan Pembelian', render: (b) => b.satuan_pembelian },
    { key: 'satuan_penjualan', header: 'Satuan Penjualan', render: (b) => b.satuan_penjualan },
    {
      key: 'konversi_satuan', header: 'Konversi',
      render: (b) => `1 ${b.satuan_pembelian} = ${Number(b.konversi_satuan)} ${b.satuan_penjualan}`,
    },
    {
      key: 'stok', header: 'Stok',
      render: (b) => {
        const stok = Number(b.stok);
        const wholesale = stok / Number(b.konversi_satuan);
        return `${stok} ${b.satuan_penjualan} (${wholesale} ${b.satuan_pembelian})`;
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Master Barang</h1>
        <Link
          href="/barang/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Tambah Barang
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or SKU..."
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={barang}
          emptyMessage="No barang found. Create your first one."
          rowActions={(b) => (
            <div className="flex items-center gap-1 justify-end">
              <button
                onClick={() => router.push(`/barang/${b.id}/edit`)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit"
              >
                <PencilSimple size={16} />
              </button>
              <button
                onClick={() => setDeleteId(b.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <Trash size={16} />
              </button>
            </div>
          )}
        />
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Barang"
        message="Are you sure you want to delete this item?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
