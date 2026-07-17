export interface Barang {
  id: string;
  nama_barang: string;
  sku: string;
  satuan_pembelian: string;
  satuan_penjualan: string;
  konversi_satuan: number;
  stok: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  nomor_transaksi: string;
  barang_id: string;
  barang: { id: string; nama_barang: string };
  tanggal: string;
  quantity: number;
  tipe: 'pembelian' | 'penjualan';
  satuan: string;
  konversi_snapshot: number;
  status: 'ACTIVE' | 'CANCELLED';
  keterangan: string | null;
  created_at: string;
}

export interface CreateBarangDto {
  nama_barang: string;
  sku: string;
  satuan_pembelian: string;
  satuan_penjualan: string;
  konversi_satuan: number;
}

export interface UpdateBarangDto extends Partial<CreateBarangDto> {}

export interface CreateTransactionDto {
  barang_id: string;
  tanggal: string;
  quantity: number;
  satuan: string;
  keterangan?: string;
  nomor_transaksi?: string;
}
