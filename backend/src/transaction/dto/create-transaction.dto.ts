import {
  IsOptional, IsString, IsUUID,
  IsDateString, IsPositive, IsIn, MaxLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  barang_id: string;

  @IsDateString()
  tanggal: string;

  @IsPositive()
  quantity: number;

  @IsIn(['pembelian', 'penjualan'])
  satuan: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  keterangan?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nomor_transaksi?: string;
}
