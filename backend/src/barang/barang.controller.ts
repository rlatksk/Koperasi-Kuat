import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { BarangService } from './barang.service';
import { CreateBarangDto } from './dto/create-barang.dto';
import { UpdateBarangDto } from './dto/update-barang.dto';

@Controller('barang')
export class BarangController {
  constructor(private readonly barangService: BarangService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.barangService.findAll(search, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const barang = await this.barangService.findOne(id);
    return {
      ...barang,
      stok_pembelian: Number(barang.stok) / Number(barang.konversi_satuan),
    };
  }

  @Post()
  create(@Body() dto: CreateBarangDto) {
    return this.barangService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBarangDto) {
    return this.barangService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.barangService.remove(id);
  }
}
