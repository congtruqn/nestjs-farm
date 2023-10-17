import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChooseGiltTicket,
  DetailTreatmentModel,
  ListSerialTreatmentModel,
} from 'src/domain/model/treatment.model';
import { IEventTicketRepository } from 'src/domain/repositories/eventTicketRepository.interface';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { EventTicketEntity } from '../entities/event-ticket.entity';
import { FindAllSerialTreatmentDto } from 'src/dtos/treatment/find-all-serial-treatment.dto';
import { ActionType, EventDefine } from 'src/domain/config/contants';
import { FindAllChooseGiltPigsDto } from 'src/dtos/choose-gilt/find-all-choose-gilts.dto';
import { calculateSkip } from 'src/utils/common';

@Injectable()
export class EventTicketRepository implements IEventTicketRepository {
  constructor(
    @InjectRepository(EventTicketEntity)
    private eventTicketRepository: Repository<EventTicketEntity>,
  ) {}

  createEventTicket(data: EventTicketEntity): EventTicketEntity {
    return this.eventTicketRepository.create(data);
  }

  async updateEventTicket(
    id: number,
    data: EventTicketEntity,
  ): Promise<EventTicketEntity> {
    const { affected } = await this.eventTicketRepository.update({ id }, data);

    if (!affected) {
      return null;
    }

    return this.eventTicketRepository.findOneBy({ id });
  }

  async findAllEventTicketByOptions(
    options: FindManyOptions<EventTicketEntity>,
  ): Promise<any[]> {
    return this.eventTicketRepository.find(options);
  }

  async findAllAndCountEventTicketByOptions(
    options?: FindManyOptions<EventTicketEntity>,
  ) {
    return this.eventTicketRepository.findAndCount(options);
  }
  async findOneEventTicketByOptions(
    options?: FindOneOptions<EventTicketEntity>,
  ): Promise<any> {
    return this.eventTicketRepository.findOne(options);
  }

  async findAllSerialEventTicket(
    farmId: number,
    skip: number,
    take: number,
    findAllSerialTreatmentDto: FindAllSerialTreatmentDto,
  ): Promise<[ListSerialTreatmentModel[], totalCount: number]> {
    const {
      statusIds = [],
      herdStatIds = [],
      diseaseIds = [],
    } = findAllSerialTreatmentDto;
    const where: FindOptionsWhere<EventTicketEntity> = {
      farmId,
      eventDefineId: EventDefine.treatment,
      actionType: ActionType.serials,
    };

    if (statusIds.length) {
      where.eventStatusId = In(statusIds);
    }

    if (diseaseIds.length) {
      where.diseaseId = In(diseaseIds);
    }
    if (herdStatIds.length) {
      where.events = {
        pigInfo: {
          herdStatId: In(herdStatIds),
        },
      };
    }
    const [result, totalCount] = await this.eventTicketRepository.findAndCount({
      where,
      skip: skip,
      take: take,
      relations: [
        'eventStatus',
        'disease',
        'block',
        'room',
        'house',
        'medicine',
      ],
      order: {
        id: 'DESC',
      },
    });
    return [result.map((item) => this.toEventTicketModel(item)), totalCount];
  }

  async findAllChooseGiltTicket(
    farmId: number,
    findAllChooseGiltPigsDto: FindAllChooseGiltPigsDto,
  ): Promise<[any[], totalCount: number]> {
    const {
      pageNumber = 1,
      pageSize = 20,
      keyword = null,
    } = findAllChooseGiltPigsDto;
    const resultQuery = this.eventTicketRepository
      .createQueryBuilder('eventTicket')
      .leftJoin('eventTicket.events', 'events')
      .select([
        `SUM(CASE
          WHEN events.selected_breed = 1 THEN 1
          ELSE 0 END) AS choiseNumber`,
        `SUM(CASE
          WHEN events.selected_breed = 0 THEN 1
          ELSE 0 END) AS rejectNumber`,
        'eventTicket.ticketId AS ticketId',
        'eventTicket.createdBy AS createdBy',
        'eventTicket.eventDate AS eventDate',
        'eventTicket.id AS id',
      ])
      .offset(calculateSkip(pageNumber, pageSize))
      .limit(pageSize)
      .groupBy(
        'eventTicket.ticket_id, eventTicket.created_by, eventTicket.event_date, eventTicket.id',
      )
      .where('eventTicket.farmId = :farmId and eventTicket.eventDefine = 5', {
        farmId: farmId,
      });
    if (keyword) {
      resultQuery.andWhere('eventTicket.ticketId Ilike :keyword', {
        keyword: `%${keyword}%`,
      });
    }
    const resultCount = resultQuery.clone();
    return await Promise.all([
      resultQuery.getRawMany(),
      resultCount.getCount(),
    ]);
  }

  async getChooseGiltTicket(farmId: number, id: number): Promise<any> {
    const result = await this.eventTicketRepository.findOne({
      where: {
        eventDefineId: 5,
        id: id,
      },
      select: {
        eventDate: true,
        ticketId: true,
        createdBy: true,
        id: true,
      },
    });
    if (!result) return null;
    return this.toChooseGiltTicketModel(result);
  }

  async getOneSerialEventTicket(
    farmId: number,
    id: number,
  ): Promise<DetailTreatmentModel> {
    const result = await this.eventTicketRepository.findOne({
      where: {
        farmId: farmId,
        eventDefineId: 3,
        id: id,
      },
      relations: [
        'eventStatus',
        'disease',
        'block',
        'room',
        'house',
        'medicine',
      ],
    });
    if (!result) return null;
    return this.toEventTicketDetailModel(result);
  }

  async getListChooseGiltEventTicket(farmId: number): Promise<any> {
    const result = await this.eventTicketRepository.findAndCount({
      where: {
        farmId: farmId,
        eventDefineId: 3,
      },
      relations: ['eventStatus', 'block', 'room', 'house'],
    });
    return result;
  }

  private toEventTicketModel(data: any): ListSerialTreatmentModel {
    const model: ListSerialTreatmentModel = new ListSerialTreatmentModel({
      id: data.id,
      ticketId: data.ticketId,
      diseaseName: data.disease.name || '',
      house: data.house?.name || '',
      room: data.room?.name || '',
      block: data.block?.name || '',
      eventStatusName: data.eventStatus?.name || '',
      eventDate: data.ticketDate || '',
      employee: data.employee || '',
      medicineName: data.medicine?.code || '',
    });
    return model;
  }

  private toEventTicketDetailModel(data: any): DetailTreatmentModel {
    const model: DetailTreatmentModel = new DetailTreatmentModel({
      id: data.id,
      ticketId: data.ticketId,
      diseaseName: data.disease.name || '',
      house: data.house?.name || '',
      houseId: data.house?.id || null,
      room: data.room?.name || '',
      roomId: data.room?.id || null,
      block: data.block?.name || '',
      blockId: data.block?.id || null,
      eventStatusName: data.eventStatus?.name || '',
      eventDate: data.ticketDate || '',
      personInCharge: data.personInCharge || '',
      medicineName: data.medicine?.code || '',
      medicineLot: data.medicineLot,
      medicineExpiry: data.medicineExpiry,
      exportId: data.exportId,
    });
    return model;
  }
  private toChooseGiltTicketModel(data: any): ChooseGiltTicket {
    const model: ChooseGiltTicket = new ChooseGiltTicket({
      id: data.id,
      ticketId: data.ticketId,
      eventDate: data.ticketDate || '',
      createdBy: data.createdBy || '',
    });
    return model;
  }
}
