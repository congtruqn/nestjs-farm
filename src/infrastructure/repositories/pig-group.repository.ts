import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PigGroupModel } from 'src/domain/model/pig-group.model';
import { IPigGroupRepository } from 'src/domain/repositories/pigGroupRepository.interface';
import {
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  In,
  Repository,
} from 'typeorm';
import { PigGroupEntity } from '../entities/pig-group.entity';
import { FindAllPigGroupDto } from 'src/dtos/pig-group/find-all-pig-group.dto';
import { calculateSkip } from 'src/utils/common';
import { EventEntity } from '../entities/event.entity';
import { FindAllEventByPigGroupDto } from 'src/dtos/pig-group/find-all-events.dto';

@Injectable()
export class PigGroupRepository implements IPigGroupRepository {
  constructor(
    @InjectRepository(PigGroupEntity)
    private pigGroupRepository: Repository<PigGroupEntity>,
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  async addPigGroup(data: PigGroupModel): Promise<PigGroupModel> {
    const entity = this.toEntity(data);
    const result = await this.pigGroupRepository.save(entity);
    return this.toModel(result);
  }

  async importPigGroup(data: PigGroupModel[]): Promise<boolean> {
    try {
      const entity = data.map((item) => this.toEntity(item));

      await this.pigGroupRepository
        .createQueryBuilder()
        .insert()
        .into(PigGroupEntity)
        .values(entity)
        .execute();

      return true;
    } catch (error) {
      console.log(error);
    }

    return false;
  }

  async updatePigGroup(
    id: number,
    data: PigGroupModel,
  ): Promise<PigGroupModel> {
    const entity = this.toEntity(data);
    const { affected } = await this.pigGroupRepository.update({ id }, entity);

    if (!affected) {
      return null;
    }

    const result = await this.pigGroupRepository.findOneBy({ id });

    return this.toModel(result);
  }

  async deletePigGroup(id: number): Promise<PigGroupModel> {
    const { affected } = await this.pigGroupRepository.update(
      { id },
      { isActive: false },
    );

    if (!affected) {
      return null;
    }

    const result = await this.pigGroupRepository.findOneBy({ id });

    return this.toModel(result);
  }

  async findOnePigGroup(id: number): Promise<PigGroupModel> {
    const result = await this.pigGroupRepository.findOne({
      where: { id: id },
    });
    if (!result) return null;
    return this.toModel(result);
  }

  async findAllEventByPigGroup(
    farmId: number,
    groupId: number,
    findAllEventByPigGroupDto: FindAllEventByPigGroupDto,
  ): Promise<any> {
    const { pageNumber = 1, pageSize = 20 } = findAllEventByPigGroupDto;
    const where: FindOptionsWhere<EventEntity> = {
      eventTicket: {
        farmId: farmId,
      },
      pigGroupId: groupId,
    };
    if (findAllEventByPigGroupDto.type != 0) {
      where.eventDefineId = findAllEventByPigGroupDto.type;
    }
    const [result, totalCount] = await this.eventRepository.findAndCount({
      where,
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
        eventTicket: {
          ticketId: true,
          medicineLot: true,
          disease: {
            name: true,
          },
          exportId: true,
          medicineExpiry: true,
          block: {
            name: true,
          },
          room: {
            name: true,
          },
          house: {
            name: true,
          },
        },
      },
    });
    return [result, totalCount];
  }

  async findAllPigGroupByOptions(
    options: FindManyOptions<PigGroupEntity> = {},
  ): Promise<PigGroupModel[]> {
    const result = await this.pigGroupRepository.find(options);
    return result.map((item) => this.toModel(item));
  }

  async findAllAndCountPigGroup(
    farmId: number,
    findAllPigGroupDto: FindAllPigGroupDto,
  ): Promise<[PigGroupModel[], number]> {
    const {
      statusIds = [],
      roomId = [],
      houseId = [],
      blockId = [],
      herdStatIds = [],
      pageNumber = 1,
      pageSize = 20,
      keyword = null,
    } = findAllPigGroupDto;
    const where: FindOptionsWhere<PigGroupEntity> = {
      farmId,
    };
    if (statusIds.length) {
      where.pigStatusId = In(statusIds);
    }

    if (herdStatIds.length) {
      where.herdStatId = In(herdStatIds);
    }
    if (roomId.length) {
      where.roomId = In(roomId);
    }

    if (houseId.length) {
      where.houseId = In(houseId);
    }
    if (blockId.length) {
      where.blockId = In(blockId);
    }
    if (keyword) {
      where.groupId = ILike(`%${keyword}%`);
    }
    const [result, totalCount] = await this.pigGroupRepository.findAndCount({
      where,
      select: {
        pigStatus: {
          name: true,
        },
        genestic: {
          name: true,
        },
        house: {
          name: true,
        },
        room: {
          name: true,
        },
        block: {
          name: true,
        },
      },
      relations: [
        'pigStatus',
        'genestic',
        'house',
        'block',
        'room',
        'herdStat',
      ],
      skip: calculateSkip(pageNumber, pageSize),
      take: pageSize,
      order: {
        id: 'DESC',
      },
    });

    return [result.map((item) => this.toModel(item)), totalCount];
  }

  private toEntity(data: PigGroupModel) {
    const entity = new PigGroupEntity();

    entity.groupId = data.groupId;
    entity.groupType = data.groupType;
    entity.birthDate = data.birthDate;
    entity.inventory = data.inventory;
    entity.registerId = data.registerId;
    entity.origin = data.origin;
    entity.farmId = data.farmId;
    entity.createBy = data.createBy;
    entity.updateBy = data.updateBy;
    return entity;
  }

  private toModel(data: PigGroupEntity) {
    const model: PigGroupModel = new PigGroupModel({
      id: data.id,
      groupId: data.groupId,
      groupType: data.groupType,
      birthDate: data.birthDate,
      inventory: data.inventory,
      registerId: data.registerId,
      origin: data.origin,
      farmId: data.farmId,
      createBy: data.createBy,
      updateBy: data.updateBy,
      createDateTime: data.createDateTime,
      updateDateTime: data.updateDateTime,
      status: data.status,
      isActive: data.isActive,
      pigStatus: data.pigStatus?.name || '',
      genestic: data.genestic?.name || '',
      house: data.house?.name || '',
      room: data.room?.name || '',
      block: data.block?.name || '',
      birthWeek: data.birthWeek,
      inWeek: data.inWeek,
      removeQuantityInGroup: data.removeQuantityInGroup,
      standardQuantityInGroup: data.standardQuantityInGroup,
      totalWeight: data.totalWeight,
      averageWeight: data.averageWeight,
      receivedDate: data.receivedDate,
      herdStat: data.herdStat?.name || '',
    });

    return model;
  }
}
