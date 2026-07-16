'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Barang } from '@/types';
import { api } from '@/lib/api';
import BarangForm from '@/components/barang-form';

export default function EditBarangPage() {
  const { id } = useParams<{ id: string }>();
  const [barang, setBarang] = useState<Barang | null>(null);

  useEffect(() => {
    api.barang.get(id).then(setBarang).catch(console.error);
  }, [id]);

  if (!barang) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Barang</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <BarangForm barang={barang} />
      </div>
    </div>
  );
}
