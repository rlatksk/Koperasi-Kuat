import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Barang } from '../../barang/entities/barang.entity';

@Entity('stock_transaction')
export class StockTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nomor_transaksi: string;

  @Column({ type: 'uuid' })
  barang_id: string;

  @ManyToOne(() => Barang)
  @JoinColumn({ name: 'barang_id' })
  barang: Barang;

  @Column({ type: 'date' })
  tanggal: Date;

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  quantity: number;

  @Column({ type: 'varchar', length: 50 })
  satuan: string;

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  konversi_snapshot: number;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status: string;

  @Column({ type: 'text', nullable: true })
  keterangan: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
