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
    satuan: '',
    keterangan: '',
    nomor_transaksi: '',
  });
  const [autoSequence, setAutoSequence] = useState('');
  const [isManual, setIsManual] = useState(false);
  const [manualSequence, setManualSequence] = useState('');
  const [customSequence, setCustomSequence] = useState<string | null>(null);
  const [sequenceError, setSequenceError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedBarang = barangList.find((b) => b.id === form.barang_id);

  useEffect(() => {
    api.barang.list({ limit: 1000 }).then((res) => setBarangList(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isManual && form.tanggal) {
      api.transaction.sequencePreview(form.tanggal).then((res) => {
        setAutoSequence(res.sequence);
        setManualSequence(res.sequence);
      }).catch(() => {});
    }
  }, [form.tanggal, isManual]);

  useEffect(() => {
    if (selectedBarang && !form.satuan) {
      setForm((f) => ({ ...f, satuan: selectedBarang.satuan_pembelian }));
    }
  }, [form.barang_id, selectedBarang?.satuan_pembelian, form.satuan]);

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

    if (customSequence) {
      data.nomor_transaksi = customSequence;
    }

    try {
      await api.transaction.create(data);
      success('Transaksi berhasil dibuat');
      router.push('/transaction');
      router.refresh();
    } catch (err: any) {
      if (err.message?.includes('exists') || err.message?.includes('sudah ada')) {
        setSequenceError('Nomor transaksi sudah ada');
      } else {
        error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const satuanOptions = selectedBarang
    ? [
        { value: selectedBarang.satuan_pembelian, label: `Grosir (${selectedBarang.satuan_pembelian})` },
        { value: selectedBarang.satuan_penjualan, label: `Eceran (${selectedBarang.satuan_penjualan})` },
      ]
    : [];

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
          <option value="">Pilih Barang...</option>
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

      {selectedBarang && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
          <select
            value={form.satuan}
            onChange={(e) => setForm((f) => ({ ...f, satuan: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {satuanOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Jumlah
          {form.satuan && <span className="text-gray-400 font-normal ml-1">({form.satuan})</span>}
        </label>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Transaksi</label>
        {!isManual ? (
          <div className="flex items-center gap-2">
            <span className={`px-3 py-2 bg-gray-100 border rounded-md text-sm text-gray-600 flex-1 font-mono ${
              sequenceError ? 'border-red-500 ring-2 ring-red-200 text-red-600' : 'border-gray-300'
            }`}>
              {customSequence || autoSequence || 'Memuat...'}
            </span>
            <button
              type="button"
              onClick={() => {
                setManualSequence(customSequence || autoSequence);
                setIsManual(true);
              }}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <PencilSimple size={14} />
              Ubah
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
                  setCustomSequence(null);
                  setSequenceError('');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={14} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomSequence(manualSequence);
                  setIsManual(false);
                  setSequenceError('');
                }}
                className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
              >
                <Check size={14} />
              </button>
            </div>
          </div>
        )}
        {sequenceError && (
          <p className="text-xs text-red-600 mt-1">{sequenceError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan (opsional)</label>
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
          {loading ? 'Membuat...' : 'Buat Transaksi'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/transaction')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
