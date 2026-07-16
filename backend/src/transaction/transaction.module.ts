import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockTransaction } from './entities/transaction.entity';
import { SequenceCounter } from './entities/sequence-counter.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { BarangModule } from '../barang/barang.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockTransaction, SequenceCounter]),
    BarangModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
