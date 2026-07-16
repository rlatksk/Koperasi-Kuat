import {
  Injectable, NotFoundException, ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DataSource } from 'typeorm';
import { Barang } from './entities/barang.entity';
import { CreateBarangDto } from './dto/create-barang.dto';
import { UpdateBarangDto } from './dto/update-barang.dto';

@Injectable()
export class BarangService {
  constructor(
    @InjectRepository(Barang)
    private barangRepository: Repository<Barang>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateBarangDto): Promise<Barang> {
    const existing = await this.barangRepository.findOne({ where: { sku: dto.sku } });
    if (existing) {
      throw new ConflictException('SKU already exists');
    }
    const barang = this.barangRepository.create(dto);
    return this.barangRepository.save(barang);
  }

  async findAll(search?: string, page = 1, limit = 10): Promise<{ data: Barang[]; total: number }> {
    const where = search
      ? [
          { nama_barang: ILike(`%${search}%`) },
          { sku: ILike(`%${search}%`) },
        ]
      : {};
    const [data, total] = await this.barangRepository.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Barang> {
    const barang = await this.barangRepository.findOne({ where: { id } });
    if (!barang) {
      throw new NotFoundException('Barang not found');
    }
    return barang;
  }

  async update(id: string, dto: UpdateBarangDto): Promise<Barang> {
    const barang = await this.findOne(id);
    if (dto.sku && dto.sku !== barang.sku) {
      const existing = await this.barangRepository.findOne({ where: { sku: dto.sku } });
      if (existing) {
        throw new ConflictException('SKU already exists');
      }
    }
    Object.assign(barang, dto);
    return this.barangRepository.save(barang);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.dataSource.query('DELETE FROM stock_transaction WHERE barang_id = $1', [id]);
    const result = await this.barangRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Barang not found');
    }
  }
}
