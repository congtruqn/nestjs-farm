import { Inject } from '@nestjs/common';
import { DiseaseModel } from 'src/domain/model/disease.model';
import { IDiseaseRepository } from 'src/domain/repositories/diseaseRepository.interface';

export class DiseaseUseCases {
  constructor(
    @Inject('IDiseaseRepository')
    private readonly groupRepository: IDiseaseRepository,
  ) {}
  async findAllDisease(): Promise<DiseaseModel[]> {
    return this.groupRepository.findAllDisease();
  }
}
