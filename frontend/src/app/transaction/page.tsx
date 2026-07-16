'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, X as XIcon } from '@phosphor-icons/react';
import { Transaction, Barang } from '@/types';
import { api } from '@/lib/api';
import { useToast } from '@/components/toast';
import DataTable, { Column } from '@/components/data-table';
import StatusBadge from '@/components/status-badge';
import ConfirmDialog from '@/components/confirm-dialog';

export default function TransactionPage() {
  const { success, error } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [filterBarang, setFilterBarang] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [cancelId, setCancelId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.transaction.list({
        status: filterStatus || undefined,
        barang_id: filterBarang || undefined,
        tanggal_from: filterDateFrom || undefined,
        tanggal_to: filterDateTo || undefined,
      });
      setTransactions(res.data || res);
    } catch (err: any) {
      error(err.message);
    }
  }, [filterBarang, filterStatus, filterDateFrom, filterDateTo, error]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    api.barang.list().then((res) => setBarangList(res.data)).catch(console.error);
  }, []);

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await api.transaction.cancel(cancelId);
      success('Transaksi berhasil dibatalkan');
      setCancelId(null);
      fetchData();
    } catch (err: any) {
      error(err.message);
    }
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'nomor_transaksi',
      header: 'No. Transaksi',
      render: (t) => <span className="font-mono text-xs">{t.nomor_transaksi}</span>,
      sortable: true,
    },
    {
      key: 'tanggal',
      header: 'Tanggal',
      render: (t) => new Date(t.tanggal).toLocaleDateString('id-ID'),
      sortable: true,
    },
    {
      key: 'barang',
      header: 'Barang',
      render: (t) => t.barang?.nama_barang || '-',
    },
    {
      key: 'quantity',
      header: 'Jumlah',
      render: (t) => `${Number(t.quantity)} ${t.satuan}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: 'keterangan',
      header: 'Keterangan',
      render: (t) => t.keterangan || '-',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Transaksi</h1>
        <Link
          href="/transaction/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Tambah Transaksi
        </Link>
      </div>

      <div className="flex gap-3 mb-4 items-center">
        <select
          value={filterBarang}
          onChange={(e) => setFilterBarang(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
        >
          <option value="">Semua Barang</option>
          {barangList.map((b) => (
            <option key={b.id} value={b.id}>{b.nama_barang}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
        >
          <option value="">Semua Status</option>
          <option value="CANCELLED">Dibatalkan</option>
        </select>

        <input
          type="date"
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-400">s/d</span>
        <input
          type="date"
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={transactions}
          emptyMessage="Tidak ada transaksi."
          rowActions={(t) =>
            t.status === 'ACTIVE' ? (
              <button
                onClick={() => setCancelId(t.id)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <XIcon size={12} />
                Batalkan
              </button>
            ) : null
          }
        />
      </div>

      <ConfirmDialog
        open={!!cancelId}
        title="Batalkan Transaksi"
        message="Yakin ingin membatalkan transaksi ini? Stok akan dikembalikan."
        confirmLabel="Batalkan Transaksi"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />
    </div>
  );
}
