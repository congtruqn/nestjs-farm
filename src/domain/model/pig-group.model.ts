export class PigGroupModel {
  id: number;
  groupId: string;
  groupType: number;
  birthDate: Date;
  inventory: number;
  registerId: string;
  origin: string;
  genetics: string;
  location: string;
  isActive: boolean;
  timestamp: Date;
  farmId: number;
  createBy: string;
  updateBy: string;
  pigStatus: string;
  status: number;
  createDateTime: Date;
  updateDateTime: Date;
  removeQuantityInGroup: number;
  standardQuantityInGroup: number;
  inWeek: number;
  birthWeek: number;
  totalWeight: number;
  averageWeight: number;
  receivedDate: Date;
  genestic: string;
  room: string;
  block: string;
  house: string;
  herdStat: string;
  constructor(partial: Partial<PigGroupModel>) {
    Object.assign(this, partial);
  }
}
