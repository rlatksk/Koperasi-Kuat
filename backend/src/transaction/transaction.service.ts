import {
  Injectable, NotFoundException, ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { StockTransaction } from './entities/transaction.entity';
import { SequenceCounter } from './entities/sequence-counter.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Barang } from '../barang/entities/barang.entity';
import {
  buildSequencePrefix,
  padNumber,
} from '../shared/sequence.util';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(StockTransaction)
    private txRepo: Repository<StockTransaction>,
    @InjectRepository(SequenceCounter)
    private counterRepo: Repository<SequenceCounter>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateTransactionDto): Promise<StockTransaction> {
    return this.dataSource.transaction(async (manager) => {
      let nomor = dto.nomor_transaksi;

      if (!nomor) {
        const tanggal = new Date(dto.tanggal);
        const prefix = buildSequencePrefix(tanggal);

        const counter = await manager.findOne(SequenceCounter, {
          where: { prefix },
          lock: { mode: 'pessimistic_write' },
        });

        const nextNumber = counter ? counter.last_number + 1 : 1;

        if (counter) {
          counter.last_number = nextNumber;
          await manager.save(counter);
        } else {
          await manager.save(
            manager.create(SequenceCounter, { prefix, last_number: nextNumber }),
          );
        }

        nomor = `${prefix}/${padNumber(nextNumber)}`;
      } else {
        const existing = await manager.findOne(StockTransaction, {
          where: { nomor_transaksi: nomor },
        });
        if (existing) {
          throw new ConflictException('Sequence number already exists');
        }
      }

      const barang = await manager.findOne(Barang, {
        where: { id: dto.barang_id },
      });
      if (!barang) {
        throw new NotFoundException('Barang not found');
      }

      const isPembelian = dto.tipe === 'pembelian';
      const usesWholesale = dto.satuan === barang.satuan_pembelian;

      if (dto.satuan !== barang.satuan_pembelian && dto.satuan !== barang.satuan_penjualan) {
        throw new BadRequestException(
          `Satuan harus '${barang.satuan_pembelian}' atau '${barang.satuan_penjualan}'`,
        );
      }

      const stockDelta = usesWholesale
        ? dto.quantity * Number(barang.konversi_satuan)
        : dto.quantity;

      barang.stok = isPembelian
        ? Number(barang.stok) + stockDelta
        : Number(barang.stok) - stockDelta;
      await manager.save(barang);

      const tx = manager.create(StockTransaction, {
        nomor_transaksi: nomor,
        barang_id: dto.barang_id,
        tanggal: new Date(dto.tanggal),
        quantity: dto.quantity,
        tipe: dto.tipe,
        satuan: dto.satuan,
        konversi_snapshot: Number(barang.konversi_satuan),
        status: 'ACTIVE',
        keterangan: dto.keterangan,
      });

      return manager.save(tx);
    });
  }

  async cancel(id: string): Promise<StockTransaction> {
    return this.dataSource.transaction(async (manager) => {
      const tx = await manager.findOne(StockTransaction, {
        where: { id },
      });
      if (!tx) {
        throw new NotFoundException('Transaction not found');
      }
      if (tx.status === 'CANCELLED') {
        throw new ConflictException('Transaction already cancelled');
      }

      const barang = await manager.findOne(Barang, {
        where: { id: tx.barang_id },
      });
      if (!barang) {
        throw new NotFoundException('Barang not found');
      }

      const isPembelian = tx.tipe === 'pembelian';
      const usesWholesale = tx.satuan === barang.satuan_pembelian;

      const stockDelta = usesWholesale
        ? Number(tx.quantity) * Number(tx.konversi_snapshot)
        : Number(tx.quantity);

      barang.stok = isPembelian
        ? Number(barang.stok) - stockDelta
        : Number(barang.stok) + stockDelta;
      await manager.save(barang);

      tx.status = 'CANCELLED';
      return manager.save(tx);
    });
  }

  async findAll(query?: {
    barang_id?: string;
    status?: string;
    tanggal_from?: string;
    tanggal_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: StockTransaction[]; total: number }> {
    const { barang_id, status, tanggal_from, tanggal_to, page = 1, limit = 20 } = query || {};
    const where: any = {};
    if (barang_id) where.barang_id = barang_id;
    if (status) where.status = status;
    if (tanggal_from || tanggal_to) {
      where.tanggal = Between(
        tanggal_from || '1900-01-01',
        tanggal_to || '2099-12-31',
      );
    }

    const [data, total] = await this.txRepo.findAndCount({
      where,
      relations: { barang: true },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findOne(id: string): Promise<StockTransaction> {
    const tx = await this.txRepo.findOne({
      where: { id },
      relations: { barang: true },
    });
    if (!tx) {
      throw new NotFoundException('Transaction not found');
    }
    return tx;
  }

  async previewSequence(tanggal: Date): Promise<{ sequence: string }> {
    const prefix = buildSequencePrefix(tanggal);
    const counter = await this.counterRepo.findOne({ where: { prefix } });
    const nextNumber = counter ? counter.last_number + 1 : 1;
    return { sequence: `${prefix}/${padNumber(nextNumber)}` };
  }
}
