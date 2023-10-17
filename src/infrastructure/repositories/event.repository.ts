import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventModel } from 'src/domain/model/event.model';
import { IEventRepository } from 'src/domain/repositories/eventRepository.interface';
import { Repository } from 'typeorm';
import { EventEntity } from '../entities/event.entity';
@Injectable()
export class EventRepository implements IEventRepository {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}
  findAllEvent(): Promise<EventModel[]> {
    throw new Error('Method not implemented.');
  }
  createEvent(data: EventEntity): EventEntity {
    return this.eventRepository.create(data);
  }
  async getEventByID(eventId: number): Promise<any> {
    return await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
      relations: ['pigInfo', 'pigInfo.genetic', 'pigInfo.herdStat'],
    });
  }
}
