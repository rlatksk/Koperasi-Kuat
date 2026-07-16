import {
  Controller, Get, Post, Patch,
  Param, Body, Query, ParseUUIDPipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly txService: TransactionService) {}

  @Get()
  findAll(
    @Query('barang_id') barang_id?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.txService.findAll({ barang_id, status, page, limit });
  }

  @Get('sequence-preview')
  previewSequence(@Query('tanggal') tanggal: string) {
    return this.txService.previewSequence(new Date(tanggal));
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.txService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.txService.create(dto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.txService.cancel(id);
  }
}
