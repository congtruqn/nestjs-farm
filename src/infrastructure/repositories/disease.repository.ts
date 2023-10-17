import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IDiseaseRepository } from 'src/domain/repositories/diseaseRepository.interface';
import { Repository } from 'typeorm';
import { DiseaseEntity } from '../entities/disease.entity';
import { DiseaseModel } from 'src/domain/model/disease.model';

@Injectable()
export class DiseaseRepository implements IDiseaseRepository {
  constructor(
    @InjectRepository(DiseaseEntity)
    private DiseaseRepository: Repository<DiseaseEntity>,
  ) {}

  async findAllDisease(): Promise<any[]> {
    const result = await this.DiseaseRepository.find({
      where: {
        isActive: true,
      },
    });
    return result.map((item) => this.toModel(item));
  }

  private toModel(data: DiseaseEntity): DiseaseModel {
    const model: DiseaseModel = new DiseaseModel(data);
    return model;
  }
}
