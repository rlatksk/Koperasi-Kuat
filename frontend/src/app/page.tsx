'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ArrowsLeftRight, CheckCircle } from '@phosphor-icons/react';
import { Barang, Transaction } from '@/types';
import { api } from '@/lib/api';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);

  useEffect(() => {
    api.barang.list().then(setBarang).catch(console.error);
    api.transaction.list({ limit: 10 }).then((res) => {
      setRecentTx(res.data || []);
    }).catch(console.error);
  }, []);

  const totalStock = barang.reduce((sum, b) => sum + Number(b.stok), 0);
  const activeTx = recentTx.filter((t) => t.status === 'ACTIVE').length;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon={Package} label="Total Barang" value={barang.length} color="bg-blue-600" />
        <StatCard icon={CheckCircle} label="Total Stock (Retail)" value={`${totalStock} unit`} color="bg-green-600" />
        <StatCard icon={ArrowsLeftRight} label="Active Transactions" value={activeTx} color="bg-purple-600" />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Recent Transactions</h2>
          <Link href="/transaction" className="text-xs text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        {recentTx.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No transactions yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Transaksi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barang</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{tx.nomor_transaksi}</td>
                  <td className="px-4 py-3 text-gray-700">{tx.barang?.nama_barang || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {Number(tx.quantity)} ({tx.satuan})
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tx.status === 'ACTIVE' ? 'Active' : 'Cancelled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
