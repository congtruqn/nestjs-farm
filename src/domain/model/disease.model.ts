export class DiseaseModel {
  id: number;
  groupId: number;
  code: string;
  name: string;
  desciption: string;
  isActive: boolean;
  constructor(partial: Partial<DiseaseModel>) {
    Object.assign(this, partial);
  }
}
