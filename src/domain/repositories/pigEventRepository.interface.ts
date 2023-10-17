import { PigEventEntity } from 'src/infrastructure/entities/pig-event.entity';

export interface IPigEventRepository {
  createPigEvent(data: PigEventEntity): PigEventEntity;
  updatePigEvent(id: number, famId: number, data: PigEventEntity): Promise<any>;
  savePigEvent(data: PigEventEntity): Promise<any>;
}
