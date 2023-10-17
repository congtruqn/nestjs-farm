import { EventEntity } from 'src/infrastructure/entities/event.entity';
import { EventModel } from '../model/event.model';

export interface IEventRepository {
  findAllEvent(): Promise<EventModel[]>;
  createEvent(data: EventEntity): EventEntity;
  getEventByID(eventId: number): any;
}
