'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, PencilSimple, Trash, CaretLeft, CaretRight } from '@phosphor-icons/react';
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
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const totalPages = Math.ceil(total / limit);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.barang.list({ search: search || undefined, page, limit });
      setBarang(res.data);
      setTotal(res.total);
    } catch (err: any) {
      error(err.message);
    }
  }, [search, page, error]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.barang.delete(deleteId);
      success('Barang berhasil dihapus');
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
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Cari berdasarkan nama atau SKU..."
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={barang}
          emptyMessage="Tidak ada barang. Buat barang pertama Anda."
          rowActions={(b) => (
            <div className="flex items-center gap-1 justify-end">
              <button
                onClick={() => router.push(`/barang/${b.id}/edit`)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Ubah"
              >
                <PencilSimple size={16} />
              </button>
              <button
                onClick={() => setDeleteId(b.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Hapus"
              >
                <Trash size={16} />
              </button>
            </div>
          )}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>
            Halaman {page} dari {totalPages} ({total} data)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Hapus Barang"
        message="Yakin ingin menghapus item ini?"
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
