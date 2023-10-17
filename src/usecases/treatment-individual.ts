import { BadRequestException, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ActionType, EventDefine } from 'src/domain/config/contants';
import { FindAllTreatmentIndividualModel } from 'src/domain/model/event-ticket.model';
import { IEventRepository } from 'src/domain/repositories/eventRepository.interface';
import { IEventTicketRepository } from 'src/domain/repositories/eventTicketRepository.interface';
import { IPigInfoRepository } from 'src/domain/repositories/pigInfoRepository.interface';
import { CreateIndividualTreatmentDto } from 'src/dtos/treatment/create-individual-treatment.dto';
import { QueryFindAllTreatmentIndividualDto } from 'src/dtos/treatment/find-all-treatment-individual.dto';
import { EventTicketEntity } from 'src/infrastructure/entities/event-ticket.entity';
import { EventEntity } from 'src/infrastructure/entities/event.entity';
import { calculateSkip } from 'src/utils/common';
import { generateTicket } from 'src/utils/generateTicketId';
import { DataSource, FindOptionsWhere, In } from 'typeorm';
import { EventStatus } from './../domain/config/contants';
import { UpdateIndividualTreatmentDto } from './../dtos/treatment/create-individual-treatment.dto';

export class TreatmentIndividualUseCases {
  constructor(
    @Inject('IEventTicketRepository')
    private readonly eventTicketRepository: IEventTicketRepository,

    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,

    @Inject('IPigInfoRepository')
    private readonly pigInfoRepository: IPigInfoRepository,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async approveIndividual(id: number, farmId: number, updatedBy: string) {
    const eventTicket =
      await this.eventTicketRepository.findOneEventTicketByOptions({
        where: {
          id,
          farmId,
        },
        select: {
          id: true,
        },
      });

    if (!eventTicket) throw new BadRequestException('TICKET_DOSE_NOT_EXIST');

    const entity = new EventTicketEntity({});
    entity.eventStatusId = EventStatus.treatment;
    entity.updatedBy = updatedBy;

    await this.eventTicketRepository.updateEventTicket(id, entity);

    return id;
  }

  async createTreatmentIndividual(data: CreateIndividualTreatmentDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      const pigInfo = await this.pigInfoRepository.findOnePigInfoOptions({
        where: {
          stig: data.stig,
          farmId: data.farmId,
        },
      });

      if (!pigInfo) throw new BadRequestException('PigInfo_DOSE_NOT_EXIST');

      const entity = new EventTicketEntity(data);
      entity.ticketId = await generateTicket(
        this.dataSource,
        EventDefine.treatment,
      );
      entity.actionType = ActionType.individual;
      entity.eventStatusId =
        data.createType === EventStatus.save
          ? EventStatus.save
          : EventStatus.treatment;
      entity.eventDefineId = EventDefine.treatment;
      entity.blockId = pigInfo.blockId;
      entity.houseId = pigInfo.houseId;
      entity.roomId = pigInfo.roomId;
      entity.penId = pigInfo.penId;

      await queryRunner.connect();
      await queryRunner.startTransaction();

      const ticket = this.eventTicketRepository.createEventTicket(entity);

      await queryRunner.manager.save(EventTicketEntity, ticket);

      const event = new EventEntity({});

      event.pigInfoId = pigInfo.id;
      event.eventTicketId = ticket.id;
      event.eventDate = data.eventDate;
      event.createdBy = data.createdBy;

      const createEvent = this.eventRepository.createEvent(event);

      await queryRunner.manager.save(EventEntity, createEvent);
      await queryRunner.commitTransaction();
      return ticket.id;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('CREATE_EVENT_FAIL');
    } finally {
      await queryRunner.release();
    }
  }

  async updateTreatmentIndividual(
    id: number,
    data: UpdateIndividualTreatmentDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const eventTicket =
        await this.eventTicketRepository.findOneEventTicketByOptions({
          where: { id, eventStatusId: EventStatus.save },
          select: {
            id: true,
          },
        });

      if (!eventTicket) throw new BadRequestException('TICKET_DOSE_NOT_EXIST');

      const pigInfo = await this.pigInfoRepository.findOnePigInfoOptions({
        where: {
          stig: data.stig,
          farmId: data.farmId,
        },
      });

      if (!pigInfo) throw new BadRequestException('PIGINFO_DOSE_NOT_EXIST');

      await queryRunner.connect();
      await queryRunner.startTransaction();

      const eventTicketEntity = new EventTicketEntity({});
      eventTicketEntity.exportId = data.exportId;
      eventTicketEntity.diseaseId = data.diseaseId;
      eventTicketEntity.medicineId = data.medicineId;
      eventTicketEntity.eventDate = data.eventDate;
      eventTicketEntity.employee = data.employee;
      eventTicketEntity.updatedBy = data.updatedBy;
      eventTicketEntity.medicineLot = data.medicineLot;
      eventTicketEntity.medicineExpiry = data.medicineExpiry;
      eventTicketEntity.blockId = pigInfo.blockId;
      eventTicketEntity.blockId = pigInfo.blockId;
      eventTicketEntity.houseId = pigInfo.houseId;
      eventTicketEntity.roomId = pigInfo.roomId;
      eventTicketEntity.penId = pigInfo.penId;
      eventTicketEntity.eventStatusId =
        data.createType === EventStatus.save
          ? EventStatus.save
          : EventStatus.treatment;

      await queryRunner.manager.update(
        EventTicketEntity,
        { id },
        eventTicketEntity,
      );

      const eventEntity = new EventEntity({});

      eventEntity.pigInfoId = pigInfo.id;
      eventEntity.eventDate = data.eventDate;

      await queryRunner.manager.update(
        EventEntity,
        { eventTicketId: eventTicket.id },
        eventEntity,
      );
      await queryRunner.commitTransaction();
      return eventTicket.id;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('UPDATE_EVENT_FAIL');
    } finally {
      await queryRunner.release();
    }
  }

  async findAllTreatmentIndividual(
    farmId: number,
    query: QueryFindAllTreatmentIndividualDto,
  ) {
    const {
      pageNumber = 1,
      pageSize = 10,
      statusIds = [],
      herdStatIds = [],
      diseaseIds = [],
    } = query;

    const where: FindOptionsWhere<EventTicketEntity> = {
      farmId,
      eventDefineId: EventDefine.treatment,
      actionType: ActionType.individual,
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

    const [result, totalCount] =
      await this.eventTicketRepository.findAllAndCountEventTicketByOptions({
        where,
        select: {
          id: true,
          ticketId: true,
          employee: true,
          exportId: true,
          medicineLot: true,
          medicineExpiry: true,
          eventStatus: {
            id: true,
            name: true,
          },
          events: {
            id: true,
            createdBy: true,
            eventDate: true,
            pigInfo: {
              id: true,
              stig: true,
              tattoo: true,
              dob: true,
              genetic: {
                pigTypeCode: true,
                name: true,
              },
              herdStat: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
          disease: {
            id: true,
            name: true,
          },
          medicine: {
            id: true,
            code: true,
            name: true,
          },
          block: {
            id: true,
            code: true,
            name: true,
          },
          house: {
            id: true,
            code: true,
            name: true,
          },
          room: {
            id: true,
            code: true,
            name: true,
          },
        },
        relations: [
          'eventStatus',
          'events.pigInfo.genetic',
          'events.pigInfo.herdStat',
          'disease',
          'medicine',
          'block',
          'house',
          'room',
        ],
        skip: calculateSkip(pageNumber, pageSize),
        take: pageSize,
      });

    const items = (result as FindAllTreatmentIndividualModel[]).map((item) => ({
      id: item.id,
      ticketId: item.ticketId,
      exportId: item.exportId,
      medicineLot: item.medicineLot,
      medicineExpiry: item.medicineExpiry,
      employee: item.employee,
      blockCode: item.block?.code || null,
      blockName: item.block?.name || null,
      houseCode: item.house?.code || null,
      houseName: item.house?.name || null,
      roomCode: item.room?.code || null,
      roomName: item.room?.name || null,
      ...item.events.map((e) => ({
        eventDate: e.eventDate,
        pigInfoTattoo: e.pigInfo.tattoo,
        pigInfoStig: e.pigInfo.stig,
        pigInfoDob: e.pigInfo.dob,
        pigInfoGeneticPigTypeCode: e.pigInfo.genetic.pigTypeCode,
        pigInfoGeneticName: e.pigInfo.genetic.name,
        pigInfoHerdStatCode: e.pigInfo.herdStat.code,
        pigInfoHerdStatName: e.pigInfo.herdStat.name,
      }))[0],
      eventStatusName: item.eventStatus.name,
      diseaseName: item.disease.name,
      medicineCode: item.medicine.code,
      medicineName: item.medicine.name,
    }));

    return {
      totalPage: Math.ceil(totalCount / pageSize),
      totalCount,
      items,
    };
  }

  async findOneEventTicketByOptions(farmId: number, id: number) {
    const result = await this.eventTicketRepository.findOneEventTicketByOptions(
      {
        where: {
          id,
          farmId,
          actionType: ActionType.individual,
        },
        select: {
          id: true,
          ticketId: true,
          employee: true,
          exportId: true,
          medicineLot: true,
          medicineExpiry: true,
          eventStatus: {
            id: true,
            name: true,
          },
          events: {
            id: true,
            createdBy: true,
            eventDate: true,
            pigInfo: {
              id: true,
              stig: true,
              tattoo: true,
              dob: true,
              genetic: {
                pigTypeCode: true,
                name: true,
              },
              herdStat: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
          disease: {
            id: true,
            name: true,
          },
          medicine: {
            id: true,
            code: true,
            name: true,
          },
          block: {
            id: true,
            code: true,
            name: true,
          },
          house: {
            id: true,
            code: true,
            name: true,
          },
          room: {
            id: true,
            code: true,
            name: true,
          },
        },
        relations: [
          'eventStatus',
          'events.pigInfo.genetic',
          'events.pigInfo.herdStat',
          'disease',
          'medicine',
          'block',
          'house',
          'room',
        ],
      },
    );

    return {
      id: result.id,
      ticketId: result.ticketId,
      exportId: result.exportId,
      medicineLot: result.medicineLot,
      medicineExpiry: result.medicineExpiry,
      employee: result.employee,
      blockCode: result.block?.code || null,
      blockName: result.block?.name || null,
      houseCode: result.house?.code || null,
      houseName: result.house?.name || null,
      roomCode: result.room?.code || null,
      roomName: result.room?.name || null,
      ...result.events.map((e: EventEntity) => ({
        eventDate: e.eventDate,
        pigInfoTattoo: e.pigInfo.tattoo,
        pigInfoStig: e.pigInfo.stig,
        pigInfoDob: e.pigInfo.dob,
        pigInfoGeneticPigTypeCode: e.pigInfo.genetic.pigTypeCode,
        pigInfoGeneticName: e.pigInfo.genetic.name,
        pigInfoHerdStatCode: e.pigInfo.herdStat.code,
        pigInfoHerdStatName: e.pigInfo.herdStat.name,
      }))[0],
      eventStatusName: result.eventStatus.name,
      diseaseName: result.disease.name,
      medicineCode: result.medicine.code,
      medicineName: result.medicine.name,
    };
  }
}
