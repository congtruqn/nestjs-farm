import { Inject } from '@nestjs/common';
import { DiseaseModel } from 'src/domain/model/disease.model';
import { IReasonRepository } from 'src/domain/repositories/reasonRepository.interface';

export class ReasonUseCases {
  constructor(
    @Inject('IReasonRepository')
    private readonly reasonRepository: IReasonRepository,
  ) {}
  async getPregnancyTestReason(): Promise<DiseaseModel[]> {
    return this.reasonRepository.getPregnancyTestReason();
  }
}
