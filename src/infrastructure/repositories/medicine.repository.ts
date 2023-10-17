import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMedicineRepository } from 'src/domain/repositories/medicineRepository.interface';
import { MedicineEntity } from '../entities/medicine.entity';

@Injectable()
export class MedicineRepository implements IMedicineRepository {
  constructor(
    @InjectRepository(MedicineEntity)
    private medicineRepository: Repository<MedicineEntity>,
  ) {}

  async findAllMedicine(): Promise<any[]> {
    return await this.medicineRepository.find({
      where: {
        isActive: true,
      },
      select: {
        code: true,
        id: true,
        name: true,
      },
    });
  }
}
