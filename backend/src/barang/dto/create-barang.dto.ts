import { IsNotEmpty, IsString, IsPositive, MaxLength } from 'class-validator';

export class CreateBarangDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  nama_barang: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  sku: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  satuan_pembelian: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  satuan_penjualan: string;

  @IsPositive()
  konversi_satuan: number;
}
