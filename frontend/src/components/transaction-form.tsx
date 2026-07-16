'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PencilSimple, Check, X } from '@phosphor-icons/react';
import { Barang, CreateTransactionDto } from '@/types';
import { api } from '@/lib/api';
import { useToast } from '@/components/toast';

export default function TransactionForm() {
  const router = useRouter();
  const { success, error } = useToast();
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [form, setForm] = useState({
    barang_id: '',
    tanggal: new Date().toISOString().split('T')[0],
    quantity: '',
    satuan: 'pembelian' as 'pembelian' | 'penjualan',
    keterangan: '',
    nomor_transaksi: '',
  });
  const [autoSequence, setAutoSequence] = useState('');
  const [isManual, setIsManual] = useState(false);
  const [manualSequence, setManualSequence] = useState('');
  const [sequenceError, setSequenceError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.barang.list().then(setBarangList).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isManual && form.tanggal) {
      api.transaction.sequencePreview(form.tanggal).then((res) => {
        setAutoSequence(res.sequence);
        setManualSequence(res.sequence);
      }).catch(() => {});
    }
  }, [form.tanggal, isManual]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSequenceError('');

    const data: CreateTransactionDto = {
      barang_id: form.barang_id,
      tanggal: form.tanggal,
      quantity: parseFloat(form.quantity),
      satuan: form.satuan,
      keterangan: form.keterangan || undefined,
    };

    if (isManual) {
      data.nomor_transaksi = manualSequence;
    }

    try {
      await api.transaction.create(data);
      success('Transaction created successfully');
      router.push('/transaction');
      router.refresh();
    } catch (err: any) {
      if (err.message?.includes('Sequence number already exists') || err.message?.includes('exists')) {
        setSequenceError('Sequence number already exists');
      } else {
        error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Barang</label>
        <select
          value={form.barang_id}
          onChange={(e) => setForm((f) => ({ ...f, barang_id: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select Barang...</option>
          {barangList.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nama_barang} ({b.sku})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
        <input
          type="date"
          value={form.tanggal}
          onChange={(e) => setForm((f) => ({ ...f, tanggal: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
        <input
          type="number"
          value={form.quantity}
          onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="0.000001"
          step="any"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Satuan</label>
        <div className="flex gap-4">
          {(['pembelian', 'penjualan'] as const).map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="satuan"
                value={s}
                checked={form.satuan === s}
                onChange={() => setForm((f) => ({ ...f, satuan: s }))}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 capitalize">{s}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Transaksi</label>
        {!isManual ? (
          <div className="flex items-center gap-2">
            <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600 flex-1 font-mono">
              {autoSequence || 'Loading...'}
            </span>
            <button
              type="button"
              onClick={() => setIsManual(true)}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <PencilSimple size={14} />
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={manualSequence}
                onChange={(e) => {
                  setManualSequence(e.target.value);
                  setSequenceError('');
                }}
                className={`flex-1 px-3 py-2 border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  sequenceError ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  setIsManual(false);
                  setSequenceError('');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsManual(false)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
              >
                <Check size={14} />
              </button>
            </div>
            {sequenceError && (
              <p className="text-xs text-red-600">{sequenceError}</p>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan (optional)</label>
        <textarea
          value={form.keterangan}
          onChange={(e) => setForm((f) => ({ ...f, keterangan: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creating...' : 'Create Transaction'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/transaction')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
