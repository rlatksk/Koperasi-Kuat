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
  const [cancelId, setCancelId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.transaction.list({
        status: filterStatus || undefined,
        barang_id: filterBarang || undefined,
      });
      setTransactions(res.data || res);
    } catch (err: any) {
      error(err.message);
    }
  }, [filterBarang, filterStatus, error]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    api.barang.list().then(setBarangList).catch(console.error);
  }, []);

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await api.transaction.cancel(cancelId);
      success('Transaction cancelled');
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
      header: 'Quantity',
      render: (t) => `${Number(t.quantity)} ${t.satuan === 'pembelian' ? '(Wholesale)' : '(Retail)'}`,
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

      <div className="flex gap-3 mb-4">
        <select
          value={filterBarang}
          onChange={(e) => setFilterBarang(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Barang</option>
          {barangList.map((b) => (
            <option key={b.id} value={b.id}>{b.nama_barang}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={transactions}
          emptyMessage="No transactions found."
          rowActions={(t) =>
            t.status === 'ACTIVE' ? (
              <button
                onClick={() => setCancelId(t.id)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <XIcon size={12} />
                Cancel
              </button>
            ) : null
          }
        />
      </div>

      <ConfirmDialog
        open={!!cancelId}
        title="Cancel Transaction"
        message="Are you sure you want to cancel this transaction? The stock will be reversed."
        confirmLabel="Cancel Transaction"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />
    </div>
  );
}
