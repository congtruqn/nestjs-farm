import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, ILike, In, Not, Repository } from 'typeorm';
import { PigInfoEntity } from '../entities/pig-info.entity';
import { calculateSkip } from 'src/utils/common';
import { IPregnancyTestReposotory } from 'src/domain/repositories/pregnancyTestRepository.interface';
import {
  FindAllPregnancyTestEventByPigInfoDto,
  FindAllPregnancyTestEventDto,
} from 'src/dtos/pregnancy-test/find-all-pregnancy-test-events.dto';
import { PigEventEntity } from '../entities/pig-event.entity';
import { PregnancyTestEventModel } from 'src/domain/model/pregnancy-test.model';
import { EventDefine, herdStat } from 'src/domain/config/contants';

@Injectable()
export class PregnancyTestReposotory implements IPregnancyTestReposotory {
  constructor(
    @InjectRepository(PigInfoEntity)
    private pigInfoRepository: Repository<PigInfoEntity>,
    @InjectRepository(PigEventEntity)
    private pigEventRepository: Repository<PigEventEntity>,
  ) {}
  async findAllPregneancyEvents(
    findAllPregnancyTestEventDto: FindAllPregnancyTestEventDto,
  ): Promise<[any[], totalCount: number]> {
    const { pageNumber = 1, pageSize = 20 } = findAllPregnancyTestEventDto;

    const {
      blockIds = [],
      houseIds = [],
      roomIds = [],
      reasonIds = [],
      fromDate,
      toDate = new Date(),
      keyword = null,
    } = findAllPregnancyTestEventDto;
    const where: FindOptionsWhere<PigEventEntity> = {
      pigInfo: {
        farmId: findAllPregnancyTestEventDto.farmId,
      },
      eventDefineId: EventDefine.ServiceFailed,
      isDelete: false,
    };
    if (blockIds.length) {
      where.pigInfo = {
        blockId: In(blockIds),
      };
    }
    if (houseIds.length) {
      where.pigInfo = {
        houseId: In(houseIds),
      };
    }
    if (roomIds.length) {
      where.pigInfo = {
        roomId: In(roomIds),
      };
    }
    if (reasonIds.length) {
      where.reasonId = In(reasonIds);
    }
    if (fromDate) {
      where.serviceFailedDate = Between(fromDate, toDate);
    }
    if (keyword) {
      where.pigInfo = {
        stig: ILike(`%${keyword}%`),
      };
    }

    const [result, totalCount] = await this.pigEventRepository.findAndCount({
      where,
      skip: calculateSkip(pageNumber, pageSize),
      take: pageSize,
      relations: [
        'pigInfo',
        'pigInfo.house',
        'pigInfo.room',
        'pigInfo.block',
        'pigInfo.pigStatus',
        'pigInfo.herdStat',
        'eventStatus',
        'reason',
      ],
      select: {
        pigInfo: {
          block: {
            name: true,
          },
          house: {
            name: true,
          },
          room: {
            name: true,
          },
          stig: true,
          tattoo: true,
          herdStat: {
            name: true,
          },
          pigStatus: {
            name: true,
          },
        },
        createdBy: true,
        id: true,
        comment1: true,
        comment2: true,
        eventStatus: {
          name: true,
        },
        serviceFailedMethod: true,
        serviceFailedDate: true,
        personInCharge: true,
        reason: {
          nameVn: true,
          nameEng: true,
        },
        eventDate: true,
      },
    });
    return [
      result.map((item: any) => this.toPregnancyTestEventModel(item)),
      totalCount,
    ];
  }

  async getAllPregnancyTestEventByPigInfo(
    query: FindAllPregnancyTestEventByPigInfoDto,
  ): Promise<[any[], totalCount: number]> {
    const { pageNumber = 1, pageSize = 20 } = query;
    const [result, totalCount] = await this.pigEventRepository.findAndCount({
      where: {
        pigInfo: {
          farmId: query.farmId,
          id: query.pigInfoId,
        },
        eventDefineId: EventDefine.ServiceFailed,
      },
      skip: calculateSkip(pageNumber, pageSize),
      take: pageSize,
      relations: [
        'pigInfo',
        'pigInfo.house',
        'pigInfo.room',
        'pigInfo.block',
        'pigInfo.pigStatus',
        'pigInfo.herdStat',
        'eventStatus',
        'reason',
      ],
      select: {
        pigInfo: {
          block: {
            name: true,
          },
          house: {
            name: true,
          },
          room: {
            name: true,
          },
          stig: true,
          tattoo: true,
          herdStat: {
            name: true,
          },
          pigStatus: {
            name: true,
          },
        },
        createdBy: true,
        id: true,
        comment1: true,
        comment2: true,
        eventStatus: {
          name: true,
        },
        serviceFailedMethod: true,
        serviceFailedDate: true,
        personInCharge: true,
        reason: {
          nameVn: true,
          nameEng: true,
        },
        eventDate: true,
      },
    });
    return [
      result.map((item: any) => this.toPregnancyTestEventModel(item)),
      totalCount,
    ];
  }

  async deletePregneancyEventById(
    farmId: number,
    eventId: number,
  ): Promise<any> {
    const result = await this.pigEventRepository.update(
      {
        id: eventId,
        farmId: farmId,
      },
      {
        isDelete: true,
      },
    );
    return result;
  }

  async getPregneancyEventById(farmId: number, eventId: number): Promise<any> {
    const result = await this.pigEventRepository.findOne({
      where: {
        pigInfo: {
          farmId: farmId,
        },
        eventDefineId: EventDefine.ServiceFailed,
        id: eventId,
      },
      relations: [
        'pigInfo',
        'pigInfo.house',
        'pigInfo.room',
        'pigInfo.block',
        'pigInfo.pigStatus',
        'pigInfo.herdStat',
        'eventStatus',
        'reason',
      ],
      select: {
        pigInfo: {
          block: {
            name: true,
          },
          house: {
            name: true,
          },
          room: {
            name: true,
          },
          stig: true,
          tattoo: true,
          herdStat: {
            name: true,
          },
          pigStatus: {
            name: true,
          },
        },
        createdBy: true,
        id: true,
        comment1: true,
        comment2: true,
        eventStatus: {
          name: true,
        },
        serviceFailedMethod: true,
        serviceFailedDate: true,
        personInCharge: true,
        reason: {
          nameVn: true,
          nameEng: true,
        },
        eventDate: true,
      },
    });
    if (!result) return null;
    return this.toPregnancyTestEventModel(result);
  }

  private toPregnancyTestEventModel(data: any): PregnancyTestEventModel {
    const model: PregnancyTestEventModel = new PregnancyTestEventModel({
      id: data.id,
      house: data.pigInfo?.house?.name || '',
      room: data.pigInfo?.room?.name || '',
      block: data.pigInfo?.block?.name || '',
      createdBy: data.createdby || '',
      herdStat: data.pigInfo?.herdStat?.name || '',
      tattoo: data.pigInfo?.tattoo || '',
      pigStatus: data.pigInfo?.pigStatus?.name || '',
      stig: data.pigInfo?.stig || '',
      personInCharge: data.personInCharge || '',
      serviceFailedDate: data.serviceFailedDate || null,
      abortedDate: data.serviceFailedDate || null,
      serviceFailedMethod: data.serviceFailedMethod || 1,
      eventDate: data.eventDate || null,
      reason: data.reason?.nameVn || '',
      comment: data.comment || '',
      comment1: data.comment1 || '',
      comment2: data.comment2 || '',
      eventStatus: data.eventStatus?.name,
    });
    return model;
  }

  async findAllPregnancyPigs(farmId: number): Promise<any[]> {
    return await this.pigInfoRepository.find({
      where: {
        farmId: farmId,
        herdStatId: herdStat.InpigSow,
        isRemove: Not(true),
      },
      select: {
        id: true,
        stig: true,
        tattoo: true,
      },
    });
  }

  async updatePregneancyTestEvent(
    id: number,
    farmId: number,
    data: PigEventEntity,
  ): Promise<any> {
    const result = await this.pigEventRepository.update(
      {
        id: id,
        farmId: farmId,
      },
      data,
    );
    return result;
  }
}
