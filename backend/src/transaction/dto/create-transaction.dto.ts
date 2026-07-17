import {
  IsNotEmpty, IsOptional, IsString, IsUUID,
  IsDateString, IsPositive, MaxLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  barang_id: string;

  @IsDateString()
  tanggal: string;

  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
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
