import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventModel } from 'src/domain/model/event.model';
import { Repository } from 'typeorm';
import { FindTreatmentEventDto } from 'src/dtos/treatment/find-all-treatment-events.dto';
import { calculateSkip } from 'src/utils/common';
import { IPigEventRepository } from 'src/domain/repositories/pigEventRepository.interface';
import { PigEventEntity } from '../entities/pig-event.entity';
@Injectable()
export class PigEventRepository implements IPigEventRepository {
  constructor(
    @InjectRepository(PigEventEntity)
    private pigEventRepository: Repository<PigEventEntity>,
  ) {}
  findAllEvent(): Promise<EventModel[]> {
    throw new Error('Method not implemented.');
  }
  createPigEvent(data: PigEventEntity): PigEventEntity {
    return this.pigEventRepository.create(data);
  }
  async getEventByID(eventId: number): Promise<any> {
    return await this.pigEventRepository.findOne({
      where: {
        id: eventId,
      },
      relations: ['pigInfo', 'pigInfo.genetic', 'pigInfo.herdStat'],
    });
  }
  async findAllEventByPigInfo(
    farmId: number,
    pigInfoId: number,
    findTreatmentEventDto: FindTreatmentEventDto,
  ): Promise<any> {
    const { pageNumber = 1, pageSize = 20 } = findTreatmentEventDto;
    const [result, totalCount] = await this.pigEventRepository.findAndCount({
      where: {
        pigInfoId: pigInfoId,
      },
      relations: [
        'eventTicket',
        'eventDefine',
        'eventTicket.medicine',
        'eventTicket.disease',
        'eventTicket.room',
        'eventTicket.block',
        'eventTicket.house',
      ],
      skip: calculateSkip(pageNumber, pageSize),
      take: pageSize,
      order: {
        id: 'DESC',
      },
      select: {
        id: true,
        eventDate: true,
        createdBy: true,
        personInCharge: true,
        eventDefine: {
          name: true,
        },
      },
    });
    return [result, totalCount];
  }
  async updatePigEvent(
    id: number,
    farmId: number,
    data: PigEventEntity,
  ): Promise<any> {
    const result = await this.pigEventRepository.update(
      {
        id: id,
      },
      data,
    );
    return result;
  }
  async savePigEvent(data: PigEventEntity): Promise<any> {
    return this.pigEventRepository.save(data);
  }
}
