import { DiseaseModel } from '../model/disease.model';

export interface IDiseaseRepository {
  findAllDisease(): Promise<DiseaseModel[]>;
}
