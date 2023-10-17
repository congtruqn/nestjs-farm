import {
  HttpStatus,
  Inject,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import * as moment from 'moment';
import { isValidDate } from 'src/utils/common';

import {
  FindAllPregnancyTestEventByPigInfoDto,
  FindAllPregnancyTestEventDto,
  FindSowPigDto,
} from 'src/dtos/pregnancy-test/find-all-pregnancy-test-events.dto';
import { IPregnancyTestReposotory } from 'src/domain/repositories/pregnancyTestRepository.interface';
import { ImportPregnancyTestDto } from 'src/dtos/pregnancy-test/import-pregnancy-test.dto';
import { IReasonRepository } from 'src/domain/repositories/reasonRepository.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PigEventEntity } from 'src/infrastructure/entities/pig-event.entity';
import { EventDefine, herdStat } from 'src/domain/config/contants';
import { PigInfoEntity } from 'src/infrastructure/entities/pig-info.entity';
import { IPigEventRepository } from 'src/domain/repositories/pigEventRepository.interface';
import { UpdatePregnancyTestDto } from 'src/dtos/pregnancy-test/update-pregnancy-test.dto';
import { IPigInfoRepository } from 'src/domain/repositories/pigInfoRepository.interface';
import { CreatePregnancyTestDto } from 'src/dtos/pregnancy-test/create-pregnancy-test.dto';

export class PregnancyTestUseCases {
  constructor(
    @Inject('IPregnancyTestReposotory')
    private readonly pregnancyTestReposotory: IPregnancyTestReposotory,
    @Inject('IReasonRepository')
    private readonly reasonRepository: IReasonRepository,
    @Inject('IPigEventRepository')
    private readonly pigEventRepository: IPigEventRepository,
    @Inject('IPigInfoRepository')
    private readonly pigInfoRepository: IPigInfoRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAllPregnencyEvents(
    farmId: number,
    query: FindAllPregnancyTestEventDto,
  ): Promise<any> {
    query.farmId = farmId;
    const { pageSize = 20 } = query;
    const [items, totalCount] =
      await this.pregnancyTestReposotory.findAllPregneancyEvents(query);
    return {
      totalPage: Math.ceil(totalCount / pageSize),
      totalCount,
      items,
    };
  }

  async importPregnancyTest(
    farmId: number,
    data: ImportPregnancyTestDto,
  ): Promise<any> {
    const listPregnancyPigs =
      await this.pregnancyTestReposotory.findAllPregnancyPigs(farmId);
    const listReasons = await this.reasonRepository.findAllReason();
    const errors = await this.validatePregnancyTestData(
      data,
      listPregnancyPigs,
      listReasons,
    );
    if (errors) return errors;
    if (data.type == 1) return 'PASS';

    const mapPigs: any = new Map(
      listPregnancyPigs.map((object: any) => {
        return [object.stig, object];
      }),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const listPigs = [];
      for (let index = 0; index < data.Pigs.length; index++) {
        const pig = mapPigs.get(data.Pigs[index].stig);
        if (!pig)
          throw new HttpException(
            JSON.stringify({
              code: data.Pigs[index].stig,
              message: 'PIG_HAS_STIG_NOT_FOUND',
            }),
            HttpStatus.BAD_REQUEST,
          );
        const pigInfo = new PigEventEntity({
          createdBy: data.createdBy,
          eventDate: data.eventDate || new Date(),
          pigInfoId: pig.id,
          eventDefineId: EventDefine.ServiceFailed,
          serviceFailedDate: moment(
            data.Pigs[index]?.testDate,
            'DD/MM/YYYY',
          ).toDate(),
          reasonId: Number(data.Pigs[index]?.reason),
          personInCharge: data.Pigs[index]?.inseminatorId || '',
          comment1: data.Pigs[index]?.comment1 || '',
          comment2: data.Pigs[index]?.comment2 || '',
          serviceFailedMethod: Number(data.Pigs[index]?.checkMethod) || 1,
          farmId: farmId,
          eventStatusId: 14,
        });
        const newEvent = this.pigEventRepository.createPigEvent(pigInfo);
        listPigs.push(newEvent);

        //Update herd stat for Pig
        const Pig = new PigInfoEntity({
          herdStatId: herdStat.Aborted,
        });
        queryRunner.manager.update(
          PigInfoEntity,
          { id: pig.id, farmId: farmId },
          Pig,
        );
      }
      await queryRunner.manager.save(PigEventEntity, listPigs);
      await queryRunner.commitTransaction();
      return 'SUCCESS';
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        error || 'CREATE_EVENT_FAIL',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async createPregnacyTest(data: CreatePregnancyTestDto): Promise<any> {
    const pigInfo = await this.pigInfoRepository.findOnePigInfoOptions({
      where: {
        stig: data.stig,
        farmId: data.farmId,
        herdStatId: herdStat.InpigSow,
      },
    });
    if (!pigInfo) throw new BadRequestException('PIG_DOSE_NOT_EXIST');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const event = new PigEventEntity({
        createdBy: data.createdBy,
        eventDate: data.eventDate || new Date(),
        pigInfoId: pigInfo.id,
        eventDefineId: EventDefine.ServiceFailed,
        serviceFailedDate: data.servicefailedDate || null,
        reasonId: Number(data.reason),
        personInCharge: data.inseminatorId || '',
        comment1: data.comment1 || '',
        comment2: data.comment2 || '',
        serviceFailedMethod: Number(data.checkMethod) || 1,
        farmId: data.farmId,
        eventStatusId: 14,
      });
      const newEvent = this.pigEventRepository.createPigEvent(event);
      await queryRunner.manager.save(PigEventEntity, newEvent);
      //Update herd stat for Pig
      const Pig = new PigInfoEntity({
        herdStatId: herdStat.Aborted,
      });
      queryRunner.manager.update(
        PigInfoEntity,
        { id: pigInfo.id, farmId: data.farmId },
        Pig,
      );

      await queryRunner.manager.save(PigEventEntity, newEvent);
      await queryRunner.commitTransaction();
      return 'SUCCESS';
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        error || 'CREATE_EVENT_FAIL',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getPigEventById(farmId: number, eventId: number): Promise<any> {
    return this.pregnancyTestReposotory.getPregneancyEventById(farmId, eventId);
  }

  async deleteEventById(farmId: number, eventId: number): Promise<any> {
    const eventInfo = await this.pregnancyTestReposotory.getPregneancyEventById(
      farmId,
      eventId,
    );
    if (!eventInfo)
      throw new HttpException('EVENT_NOT_FOUND', HttpStatus.BAD_REQUEST);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const Pig = new PigInfoEntity({
        herdStatId: herdStat.InpigSow,
      });
      queryRunner.manager.update(
        PigInfoEntity,
        { id: eventInfo.pigInfoId, farmId: farmId },
        Pig,
      );
      const event = new PigEventEntity({
        isDelete: true,
      });
      queryRunner.manager.update(
        PigEventEntity,
        { id: eventId, farmId: farmId },
        event,
      );
      await queryRunner.commitTransaction();
      return 'SUCCESS';
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        error || 'CREATE_EVENT_FAIL',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updatePregnancyTestEventById(
    eventId: number,
    body: UpdatePregnancyTestDto,
  ): Promise<any> {
    try {
      const event = new PigEventEntity({
        updatedBy: body.createdBy,
        reasonId: Number(body.reason_id),
        personInCharge: body.inseminatorId || '',
        comment1: body.comment1 || '',
        comment2: body.comment2 || '',
        serviceFailedMethod: Number(body.checkMethod) || 1,
        serviceFailedDate: body.servicefailedDate,
        eventDate: body.testDate,
      });
      const result =
        await this.pregnancyTestReposotory.updatePregneancyTestEvent(
          eventId,
          body.farmId,
          event,
        );
      if (result && result.affected != 0) return 'SUCCESS';
      throw new HttpException('UPDATE_EVENT_FAIL', HttpStatus.BAD_REQUEST);
    } catch (error) {
      console.log(error);
      throw new HttpException('UPDATE_EVENT_FAIL', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllEventByPigInfo(
    query: FindAllPregnancyTestEventByPigInfoDto,
  ): Promise<any> {
    const { pageSize = 20 } = query;
    const [items, totalCount] =
      await this.pregnancyTestReposotory.getAllPregnancyTestEventByPigInfo(
        query,
      );
    return {
      totalPage: Math.ceil(totalCount / pageSize),
      totalCount,
      items,
    };
  }

  async getAllSow(query: FindSowPigDto): Promise<any> {
    const { pageSize = 20 } = query;
    const [items, totalCount] = await this.pigInfoRepository.getAllSow(query);
    return {
      totalPage: Math.ceil(totalCount / pageSize),
      totalCount,
      items,
    };
  }

  private async validatePregnancyTestData(
    data: ImportPregnancyTestDto,
    listPigsChooseGilts: any,
    listReasons: any,
  ): Promise<any> {
    const mapPigs: any = new Map(
      listPigsChooseGilts.map((object: any) => {
        return [object.stig, true];
      }),
    );

    const mapReasons: any = new Map(
      listReasons.map((object: any) => {
        return [object.id.toString(), true];
      }),
    );
    const errors = [];
    let numberOfRowError = 0;
    for (let index = 0; index < data.Pigs.length; index++) {
      let isRowError = 0;
      const element = data.Pigs[index];
      if (!element.stig || element.stig == null || element.stig == '') {
        const error = {
          row: index + 1,
          colum: 'STIG',
          message: 'STIG_CANNOT_EMPTY',
        };
        errors.push(error);
        isRowError++;
      }
      if (
        !element.inseminatorId ||
        element.inseminatorId == null ||
        element.inseminatorId == ''
      ) {
        const error = {
          row: index + 1,
          colum: 'INSEMINATOR_ID',
          message: 'INSEMINATOR_ID_CANNOT_EMPTY',
        };
        errors.push(error);
        isRowError++;
      }
      if (
        !element.checkMethod ||
        (element.checkMethod != 1 && element.checkMethod != 2)
      ) {
        const error = {
          row: index + 1,
          colum: 'CHECK_METHOD',
          message: 'CHECK_METHOD_MUST_BE_1_OR_2',
        };
        errors.push(error);
        isRowError++;
      }
      if (!isValidDate(element.testDate)) {
        const error = {
          row: index + 1,
          colum: 'TEST_DATE',
          message: 'TEST_DATE_IS_NOT_VALID_FORMAT',
        };
        errors.push(error);
        isRowError++;
      }
      if (!mapPigs.get(element.stig)) {
        const error = {
          row: index + 1,
          column: 'STIG',
          message: 'STIG_IS_NOT_FOUND',
        };
        errors.push(error);
        isRowError++;
      }
      if (!mapReasons.get(element.reason.toString())) {
        const error = {
          row: index + 1,
          column: 'REASON',
          message: 'REASON_IS_NOT_FOUND',
        };
        errors.push(error);
        isRowError++;
      }
      if (isRowError > 0) numberOfRowError++;
    }
    if (errors.length > 0) return { errors, numberOfRowError };
    return null;
  }
}
