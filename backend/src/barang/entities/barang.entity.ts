import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('master_barang')
export class Barang {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nama_barang: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 50 })
  satuan_pembelian: string;

  @Column({ type: 'varchar', length: 50 })
  satuan_penjualan: string;

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  konversi_satuan: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, default: 0 })
  stok: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
