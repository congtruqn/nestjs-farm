import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { PigInfoEntity } from '../entities/pig-info.entity';
import { IChooseGiltReposotory } from 'src/domain/repositories/chooseGiltRepository.interface';
import {
  FindAllChooseGiltPigByTicketDto,
  FindAllChooseGiltPigsDto,
} from 'src/dtos/choose-gilt/find-all-choose-gilts.dto';
import { ExportChooseGiltsDto } from 'src/dtos/choose-gilt/export-choose-gilts.dto';
import {
  caculatePicDate,
  caculateWeekAge,
  calculateSkip,
} from 'src/utils/common';
import {
  HasChooseGiltPigsModel,
  NeedChooseGiltsModel,
} from 'src/domain/model/choose-gilt.model';

@Injectable()
export class ChooseGiltReposotory implements IChooseGiltReposotory {
  constructor(
    @InjectRepository(PigInfoEntity)
    private pigInfoRepository: Repository<PigInfoEntity>,
  ) {}

  async findPigChooseGilt(
    findAllChooseGiltPigsDto: FindAllChooseGiltPigsDto,
  ): Promise<[NeedChooseGiltsModel[] | any[], totalCount: number]> {
    const { pageNumber = 1, pageSize = 20 } = findAllChooseGiltPigsDto;
    const resultQuery = this.pigInfoRepository
      .createQueryBuilder('pigInfo')
      .leftJoin('pigInfo.genetic', 'genetic')
      .leftJoin('pigInfo.herdStat', 'herdStat')
      .leftJoin('pigInfo.house', 'house')
      .leftJoin('pigInfo.room', 'room')
      .leftJoin('pigInfo.block', 'block')
      .select([
        `SUM(CASE
          WHEN ("pigInfo"."is_remove" = false or "pigInfo"."is_remove" is NULL) THEN 1
          ELSE 0 END) AS pigNumber`,
        '"pigInfo"."tattoo" AS tattoo',
        '"pigInfo"."dam" AS dam',
        '"pigInfo"."sire" AS sire',
        '"pigInfo"."dob" AS dob',
        '"genetic"."name" AS geneticName',
        '"pigInfo"."piglet_group_code" AS pigletGroupCode',
        '"house"."name" AS house',
        '"room"."name" AS room',
        '"block"."name" AS block',
        '"herdStat"."name" AS herdStat',
      ])
      .where(
        `"pigInfo".farm_id = :farmId and pigInfo.pigletGroupCode is NOT NULL and (pigInfo.stig = '' or pigInfo.stig is NULL)`,
        {
          farmId: findAllChooseGiltPigsDto.farmId,
        },
      )
      .groupBy(
        '"pigInfo".tattoo, "pigInfo".dam, "pigInfo".sire, "pigInfo"."dob",genetic.name, "pigInfo".piglet_group_code, house.name, herdStat.name, block.name, room.name',
      )
      .offset(calculateSkip(pageNumber, pageSize))
      .limit(pageSize);
    const resultCount = resultQuery.clone();
    const [result, totalCount] = await Promise.all([
      resultQuery.getRawMany(),
      resultCount.getCount(),
    ]);
    return [
      result.map((item: any) => this.toNeedChooseGiltsModel(item)),
      totalCount,
    ];
  }
  async findPigChooseGiltByTicket(
    findAllChooseGiltPigByTicketDto: FindAllChooseGiltPigByTicketDto,
  ): Promise<[NeedChooseGiltsModel[] | any[], totalCount: number]> {
    const { pageNumber = 1, pageSize = 20 } = findAllChooseGiltPigByTicketDto;
    let [result, totalCount] = [null, null];
    switch (findAllChooseGiltPigByTicketDto.type) {
      case 1:
        [result, totalCount] = await this.pigInfoRepository.findAndCount({
          where: {
            farmId: findAllChooseGiltPigByTicketDto.farmId,
            pigletGroupCode: Not(IsNull()),
            events: {
              selectedBreed: 1,
              eventTicket: {
                id: findAllChooseGiltPigByTicketDto.ticketId,
              },
            },
          },
          skip: calculateSkip(pageNumber, pageSize),
          take: pageSize,
          relations: [
            'events',
            'events.eventTicket',
            'house',
            'room',
            'block',
            'pigStatus',
            'genetic',
            'herdStat',
          ],
          select: {
            events: {
              selectedBreed: true,
              personInCharge: true,
              eventDate: true,
              id: true,
            },
            house: {
              name: true,
            },
            block: {
              name: true,
            },
            room: {
              name: true,
            },
            pigStatus: {
              name: true,
            },
            genetic: {
              name: true,
            },
            dob: true,
            stig: true,
            createBy: true,
            gender: true,
            tattoo: true,
            herdStat: {
              name: true,
            },
            pigletGroupCode: true,
            dam: true,
            sire: true,
            id: true,
          },
        });
        return [
          result.map((item: any) => this.toHasChooseGiltPigsModel(item)),
          totalCount,
        ];
      case 2:
        [result, totalCount] = await this.pigInfoRepository.findAndCount({
          where: {
            farmId: findAllChooseGiltPigByTicketDto.farmId,
            pigletGroupCode: Not(IsNull()),
            events: {
              selectedBreed: 0,
              eventTicket: {
                id: findAllChooseGiltPigByTicketDto.ticketId,
              },
            },
          },
          skip: calculateSkip(pageNumber, pageSize),
          take: pageSize,
          relations: [
            'events',
            'events.eventTicket',
            'house',
            'room',
            'block',
            'pigStatus',
            'genetic',
            'herdStat',
          ],
          select: {
            events: {
              selectedBreed: true,
              personInCharge: true,
              eventDate: true,
              id: true,
            },
            house: {
              name: true,
            },
            block: {
              name: true,
            },
            room: {
              name: true,
            },
            pigStatus: {
              name: true,
            },
            genetic: {
              name: true,
            },
            stig: true,
            createBy: true,
            gender: true,
            tattoo: true,
            herdStat: {
              name: true,
            },
            pigletGroupCode: true,
            dam: true,
            sire: true,
            id: true,
          },
        });
        return [
          result.map((item: any) => this.toHasChooseGiltPigsModel(item)),
          totalCount,
        ];
      default:
        break;
    }
  }
  async findPigChooseGiltByGroup(
    exportChooseGiltsDto: ExportChooseGiltsDto,
  ): Promise<any> {
    const result = await this.pigInfoRepository.find({
      where: {
        farmId: exportChooseGiltsDto.farmId,
        events: {
          selectedBreed: IsNull(),
        },
        tattoo: In(exportChooseGiltsDto.tattoo),
      },
      relations: ['events'],
    });
    return result;
  }
  async findChooseGiltPigsByTattoo(
    farmId: number,
    tattoo: string[],
  ): Promise<any[]> {
    const resultQuery = this.pigInfoRepository
      .createQueryBuilder('pigInfo')
      .leftJoin('pigInfo.events', 'events', 'events.event_define_id = 5')
      .select([
        '"pigInfo"."tattoo" AS tattoo',
        'pigInfo.id AS id,"pigInfo"."gender" AS gender',
      ])
      .where(
        `"pigInfo".farm_id = :farmId and pigInfo.piglet_group_code IS NOT NULL and (pigInfo.stig is NULL or pigInfo.stig = '') and pigInfo.tattoo IN (:...tattoo) and events.selected_breed IS NULL`,
        {
          farmId: farmId,
          tattoo: tattoo,
        },
      )
      .groupBy('pigInfo.tattoo, pigInfo.id, pigInfo.gender');
    return await Promise.all([resultQuery.getRawMany()]);
  }
  async getChooseGilt(farmId: number, id: number): Promise<any> {
    const result = await this.pigInfoRepository.findOne({
      where: {
        farmId: farmId,
        id: id,
      },
    });
    return result;
  }
  private toNeedChooseGiltsModel(data: any): NeedChooseGiltsModel {
    const model: NeedChooseGiltsModel = new NeedChooseGiltsModel({
      id: data.id,
      house: data.house || '',
      room: data.room || '',
      block: data.block || '',
      dam: data.dam || '',
      sire: data.sire || '',
      createdBy: data.createdby || '',
      geneticName: data.geneticname || '',
      groupName: data.groupname || '',
      herdStat: data.herdstat || '',
      pigNumber: Number(data.pignumber) || 0,
      weekAge: caculateWeekAge(data.dob) || 1,
      tattoo: data.tattoo || '',
      pic: caculatePicDate(data.dob) || 1,
      pigletGroupCode: data.pigletgroupcode || '',
      pigStatus: data.pigstatus || '',
    });
    return model;
  }

  private toHasChooseGiltPigsModel(data: any): HasChooseGiltPigsModel {
    const model: HasChooseGiltPigsModel = new HasChooseGiltPigsModel({
      id: data.id,
      house: data.house?.name || '',
      room: data.room?.name || '',
      block: data.block?.name || '',
      dam: data.dam || '',
      sire: data.sire || '',
      createdBy: data.createdBy || '',
      geneticName: data.genetic?.name || '',
      groupName: data.groupname || '',
      herdStat: data.herdStat?.name || '',
      weekAge: caculateWeekAge(data.dob) || 1,
      tattoo: data.tattoo || '',
      pic: caculatePicDate(data.dob) || 1,
      pigletGroupCode: data.pigletGroupCode || '',
      pigStatus: data.pigStatus?.name || '',
      personInCharge: data.events[0]?.personInCharge || '',
      stig: data.stig || '',
      sbEndDate: data.events[0]?.sbEndDate || '',
      eventDate: data.events[0]?.eventDate || '',
      eventId: data.events[0]?.id || null,
    });
    return model;
  }
}
