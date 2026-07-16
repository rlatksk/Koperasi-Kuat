import BarangForm from '@/components/barang-form';

export default function CreateBarangPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Tambah Barang</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <BarangForm />
      </div>
    </div>
  );
}
