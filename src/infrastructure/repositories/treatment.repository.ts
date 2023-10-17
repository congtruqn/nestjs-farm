import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { PigInfoEntity } from '../entities/pig-info.entity';
import { calculateSkip } from 'src/utils/common';
import { FindAllPregnancyTestEventByPigInfoDto } from 'src/dtos/pregnancy-test/find-all-pregnancy-test-events.dto';
import { PigEventEntity } from '../entities/pig-event.entity';
import { EventDefine, herdStat } from 'src/domain/config/contants';
import { ITreatmentRepository } from 'src/domain/repositories/treatmentRepository.interface';
import {
  FindAllTreatmentEventsDto,
  FindTreatmentEventByPigDto,
} from 'src/dtos/treatment/find-all-events.dto';
import { DetailTreatmentModel } from 'src/domain/model/treatment.model';

@Injectable()
export class TreatmentRepository implements ITreatmentRepository {
  constructor(
    @InjectRepository(PigInfoEntity)
    private pigInfoRepository: Repository<PigInfoEntity>,
    @InjectRepository(PigEventEntity)
    private pigEventRepository: Repository<PigEventEntity>,
  ) {}
  async findAllTreatmentEvents(
    query: FindAllTreatmentEventsDto,
  ): Promise<[any[], totalCount: number]> {
    const { pageNumber = 1, pageSize = 20 } = query;
    const { statusIds = [], herdStatIds = [], diseaseIds = [] } = query;
    const where: FindOptionsWhere<PigEventEntity> = {
      pigInfo: {
        farmId: query.farmId,
      },
      eventDefineId: EventDefine.treatment,
    };

    if (statusIds.length) {
      where.eventStatusId = In(statusIds);
    }

    if (diseaseIds.length) {
      where.diseaseId = In(diseaseIds);
    }
    if (herdStatIds.length) {
      where.pigInfo = {
        herdStatId: In(herdStatIds),
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
        'disease',
        'medicine',
        'pigInfo.genetic',
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
          genetic: {
            name: true,
          },
          dob: true,
        },
        createdBy: true,
        id: true,
        comment1: true,
        comment2: true,
        eventStatus: {
          name: true,
        },
        personInCharge: true,
        medicine: {
          name: true,
        },
        disease: {
          name: true,
        },
        medicineLot: true,
        medicineExpiry: true,
        exportId: true,
        eventDate: true,
        quantity: true,
      },
    });
    return [
      result.map((item: any) => this.toEventTicketModel(item)),
      totalCount,
    ];
  }

  async findAllTreatmentEventsByPig(
    pigInfoId: number,
    query: FindTreatmentEventByPigDto,
  ): Promise<[any[], totalCount: number]> {
    const { pageNumber = 1, pageSize = 20 } = query;
    const where: FindOptionsWhere<PigEventEntity> = {
      pigInfoId: pigInfoId,
      eventDefineId: EventDefine.treatment,
    };
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
        'disease',
        'medicine',
        'pigInfo.genetic',
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
          genetic: {
            name: true,
          },
          dob: true,
        },
        createdBy: true,
        id: true,
        comment1: true,
        comment2: true,
        eventStatus: {
          name: true,
        },
        personInCharge: true,
        medicine: {
          name: true,
        },
        disease: {
          name: true,
        },
        medicineLot: true,
        medicineExpiry: true,
        exportId: true,
        eventDate: true,
        quantity: true,
      },
    });
    return [
      result.map((item: any) => this.toEventTicketModel(item)),
      totalCount,
    ];
  }

  async getAllTreatmentEventByPigInfo(
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
        'disease',
        'pigInfo.genetic',
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
          genetic: {
            name: true,
          },
          dob: true,
        },
        createdBy: true,
        id: true,
        comment1: true,
        comment2: true,
        eventStatus: {
          name: true,
        },
        personInCharge: true,
        disease: {
          name: true,
        },
        medicineLot: true,
        medicineExpiry: true,
        exportId: true,
        eventDate: true,
        quantity: true,
      },
    });
    return [
      result.map((item: any) => this.toEventTicketModel(item)),
      totalCount,
    ];
  }

  async getOneTreatmentEvent(farmId: number, eventId: number): Promise<any> {
    const result = await this.pigEventRepository.findOne({
      where: {
        pigInfo: {
          farmId: farmId,
        },
        eventDefineId: EventDefine.treatment,
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
        'disease',
        'medicine',
        'pigInfo.genetic',
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
          genetic: {
            name: true,
          },
          dob: true,
        },
        createdBy: true,
        updatedBy: true,
        id: true,
        comment1: true,
        comment2: true,
        eventStatus: {
          name: true,
        },
        personInCharge: true,
        medicine: {
          name: true,
        },
        disease: {
          name: true,
        },
        medicineLot: true,
        medicineExpiry: true,
        exportId: true,
        eventDate: true,
        quantity: true,
      },
    });
    if (!result) return null;
    return this.toEventTicketModel(result);
  }
  private toEventTicketModel(data: any): DetailTreatmentModel {
    const model: DetailTreatmentModel = new DetailTreatmentModel({
      id: data.id,
      diseaseName: data.disease?.name || '',
      house: data.pigInfo?.house?.name || '',
      room: data.pigInfo?.room?.name || '',
      block: data.pigInfo?.block?.name || '',
      eventStatusName: data.eventStatus?.name || '',
      eventDate: data.eventDate || '',
      personInCharge: data.personInCharge || '',
      medicineName: data.medicine?.name || '',
      medicineLot: data.medicineLot,
      medicineExpiry: data.medicineExpiry,
      exportId: data.exportId,
      eventStatus: data.eventStatus?.name,
      herdStat: data.pigInfo?.herdStat?.name || '',
      tattoo: data.pigInfo?.tattoo,
      stig: data.pigInfo?.stig,
      quantity: Number(data.quantity),
      dob: data.pigInfo?.dob || null,
      geneticName: data.pigInfo?.genetic?.name || '',
      createdBy: data.createdBy || '',
      updatedBy: data.updatedBy || '',
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
