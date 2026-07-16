import {
  Injectable, NotFoundException, ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Barang } from './entities/barang.entity';
import { CreateBarangDto } from './dto/create-barang.dto';
import { UpdateBarangDto } from './dto/update-barang.dto';

@Injectable()
export class BarangService {
  constructor(
    @InjectRepository(Barang)
    private barangRepository: Repository<Barang>,
  ) {}

  async create(dto: CreateBarangDto): Promise<Barang> {
    const existing = await this.barangRepository.findOne({ where: { sku: dto.sku } });
    if (existing) {
      throw new ConflictException('SKU already exists');
    }
    const barang = this.barangRepository.create(dto);
    return this.barangRepository.save(barang);
  }

  async findAll(search?: string): Promise<Barang[]> {
    const where = search
      ? [
          { nama_barang: Like(`%${search}%`) },
          { sku: Like(`%${search}%`) },
        ]
      : {};
    return this.barangRepository.find({ where, order: { created_at: 'DESC' } });
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
    const barang = await this.findOne(id);
    const result = await this.barangRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Barang not found');
    }
  }
}
