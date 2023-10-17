import { HttpStatus, Inject, HttpException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ActionType, EventDefine } from 'src/domain/config/contants';
import * as moment from 'moment';
import {
  ChooseGiltEventModel,
  ChooseGiltTicketModel,
  ExportChooseGiltsModel,
} from 'src/domain/model/choose-gilt.model';

import { IChooseGiltReposotory } from 'src/domain/repositories/chooseGiltRepository.interface';
import { IEventRepository } from 'src/domain/repositories/eventRepository.interface';
import { IEventTicketRepository } from 'src/domain/repositories/eventTicketRepository.interface';
import { IPigInfoRepository } from 'src/domain/repositories/pigInfoRepository.interface';
import { ExportChooseGiltsDto } from 'src/dtos/choose-gilt/export-choose-gilts.dto';
import {
  FindAllChooseGiltPigByTicketDto,
  FindAllChooseGiltPigsDto,
  FindAllChooseGiltTicketDto,
} from 'src/dtos/choose-gilt/find-all-choose-gilts.dto';
import { UpdateChooseGiltEventDto } from 'src/dtos/choose-gilt/update-choose-gilt-event';
import {
  ChooseGiltItemDto,
  ChooseGiltsDto,
} from 'src/dtos/choose-gilt/validate-choose-gilts.dto';
import { EventTicketEntity } from 'src/infrastructure/entities/event-ticket.entity';
import { EventEntity } from 'src/infrastructure/entities/event.entity';
import { PigInfoEntity } from 'src/infrastructure/entities/pig-info.entity';
import { groupByProperty, isValidDate } from 'src/utils/common';
import { generateTicket } from 'src/utils/generateTicketId';
import { DataSource } from 'typeorm';

export class ChooseGiltUseCases {
  constructor(
    @Inject('IEventTicketRepository')
    private readonly eventTicketRepository: IEventTicketRepository,
    @Inject('IPigInfoRepository')
    private readonly pigInfoRepository: IPigInfoRepository,
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
    @Inject('IChooseGiltReposotory')
    private readonly chooseGiltReposotory: IChooseGiltReposotory,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAllChooseGiltTicket(
    farmId: number,
    findAllChooseGiltPigsDto: FindAllChooseGiltTicketDto,
  ): Promise<[ChooseGiltTicketModel[], totalCount: number]> {
    try {
      const [result, totalCount] =
        await this.eventTicketRepository.findAllChooseGiltTicket(
          farmId,
          findAllChooseGiltPigsDto,
        );
      return [result.map((item) => this.toChooseGiltTicket(item)), totalCount];
    } catch (error) {
      console.log(error);
      throw new HttpException('GET_TICKET_FAIL', HttpStatus.BAD_REQUEST);
    } finally {
    }
  }

  async exportPigs(farmId: number): Promise<any> {
    try {
      return farmId;
    } catch (error) {
      console.log(error);
      throw new HttpException('CREATE_EVENT_FAIL', HttpStatus.BAD_REQUEST);
    } finally {
    }
  }

  async getChooseGiltTicket(farmId: number, ticketId: number): Promise<any> {
    try {
      return await this.eventTicketRepository.getChooseGiltTicket(
        farmId,
        ticketId,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException('GET_EVENT_FAIL', HttpStatus.BAD_REQUEST);
    } finally {
    }
  }

  async importChoosePigs(farmId: number, data: ChooseGiltsDto): Promise<any> {
    const ImportPigs = groupByProperty(data.Pigs, 'stig');
    const importByStig = Object.entries(ImportPigs);

    const listStigs = [];
    importByStig.forEach(([key]) => {
      listStigs.push(key);
    });

    const mapImportPigs = groupByProperty(data.Pigs, 'tattoo');
    const importByTattoo = Object.entries(mapImportPigs);

    const listTattoo = [];
    importByTattoo.forEach(([key]) => {
      listTattoo.push(key);
    });

    const [listPigsChooseGilts, listPigs] = await Promise.all([
      await this.chooseGiltReposotory.findChooseGiltPigsByTattoo(
        farmId,
        listTattoo,
      ),
      this.pigInfoRepository.getAllPigsByStigs(data.farmId, listStigs),
    ]);
    //Validate import data
    const errors = await this.validateImportData(
      data,
      listPigsChooseGilts,
      listPigs,
    );
    if (errors) return errors;
    if (data.type == 1) return 'PASS';
    //End validate

    const ticketId = await generateTicket(
      this.dataSource,
      EventDefine.chooseGilt,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //Create ticket
      const eventTicket = new EventTicketEntity({
        ticketId: ticketId,
        eventDefineId: EventDefine.chooseGilt,
        ticketDate: data.eventDate,
        eventDate: data.eventDate,
        createdBy: data.createdBy,
        penId: null,
        employee: data.createdBy || null,
        actionType: ActionType.individual,
        eventStatusId: 7,
        farmId: farmId,
      });
      const newEventTicket =
        this.eventTicketRepository.createEventTicket(eventTicket);
      await queryRunner.manager.save(EventTicketEntity, newEventTicket);
      //Create event

      const mapListPigs = this.groupByProperty(listPigsChooseGilts, 'tattoo');

      const listPigs = [];

      importByTattoo.forEach(([key, value]) => {
        const pigData: ChooseGiltItemDto[] = value as ChooseGiltItemDto[];
        if (mapListPigs[key]?.length < pigData.length)
          throw new HttpException(
            JSON.stringify({
              code: key,
              message: 'PIGS_HAS_TATTOO_EXCEED_INVENTORY',
            }),
            HttpStatus.BAD_REQUEST,
          );
        for (let index = 0; index < pigData.length; index++) {
          let selectedBreed = 0;
          if (pigData[index].stig) selectedBreed = 1;
          const pigInfo = new EventEntity({
            createdBy: data.createdBy,
            eventDate: data.eventDate,
            pigInfoId: mapListPigs[key][index].id,
            eventTicketId: newEventTicket.id,
            eventDefineId: EventDefine.chooseGilt,
            selectedBreed: selectedBreed,
            sbScoreLegs01: pigData[index].scoreLeg1,
            sbScoreLegs02: pigData[index].scoreLeg2,
            sbAlocaFat: pigData[index].alocaFat,
            sbAlocaMeat: pigData[index].alocaMeat,
            sbEndWt: pigData[index].endWT,
            sbIndex: pigData[index].index,
            sbScoreMuscle: pigData[index].scoreMuscle,
            sbTeatsBadL: pigData[index].teatsBadL,
            sbTeatsBadR: pigData[index].teatsBadR,
            sbTeatsGoodL: pigData[index].teatsGoodL,
            sbTeatsGoodR: pigData[index].teatsGoodR,
            sbEndDate: moment(pigData[index].endDate, 'DD/MM/YYYY').toDate(),
            disposalReason: pigData[index].disposalReason,
          });
          const newChoose = this.eventRepository.createEvent(pigInfo);
          listPigs.push(newChoose);

          //Update stig for Pig
          const Pig = new PigInfoEntity({
            stig: pigData[index].stig,
          });
          queryRunner.manager.update(
            PigInfoEntity,
            { id: mapListPigs[key][index].id, farmId: farmId },
            Pig,
          );
        }
      });

      await queryRunner.manager.save(EventEntity, listPigs);

      await queryRunner.commitTransaction();
      return ticketId;
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
  async getAllChooseGiltPigs(
    findAllChooseGiltPigsDto: FindAllChooseGiltPigsDto,
  ): Promise<any> {
    try {
      const { pageSize = 20 } = findAllChooseGiltPigsDto;
      const [items, totalCount] =
        await this.chooseGiltReposotory.findPigChooseGilt(
          findAllChooseGiltPigsDto,
        );
      return {
        totalPage: Math.ceil(totalCount / pageSize),
        totalCount,
        items,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('GET_DATA_FAIL', HttpStatus.BAD_REQUEST);
    } finally {
    }
  }

  async getAllChooseGiltPigsByTicket(
    findAllChooseGiltPigByTicketDto: FindAllChooseGiltPigByTicketDto,
  ): Promise<any> {
    try {
      const { pageSize = 20 } = findAllChooseGiltPigByTicketDto;
      const [items, totalCount] =
        await this.chooseGiltReposotory.findPigChooseGiltByTicket(
          findAllChooseGiltPigByTicketDto,
        );
      return {
        totalPage: Math.ceil(totalCount / pageSize),
        totalCount,
        items,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('GET_DATA_FAIL', HttpStatus.BAD_REQUEST);
    } finally {
    }
  }

  async getChooseGiltsEventById(eventId: number): Promise<any> {
    try {
      const result = await this.eventRepository.getEventByID(eventId);
      return this.toChooseGiltEventModel(result);
    } catch (error) {
      console.log(error);
      throw new HttpException('GET_DATA_FAIL', HttpStatus.BAD_REQUEST);
    } finally {
    }
  }

  async updateChooseGiltsEventById(
    eventId: number,
    updateChooseGiltEventDto: UpdateChooseGiltEventDto,
  ): Promise<any> {
    const eventinfo = await this.eventRepository.getEventByID(eventId);
    if (!eventinfo)
      throw new HttpException('EVENT_NOT_FOUND', HttpStatus.BAD_REQUEST);

    if (
      updateChooseGiltEventDto.disposalReason !== null &&
      updateChooseGiltEventDto.disposalReason !== '' &&
      updateChooseGiltEventDto.stig !== null &&
      updateChooseGiltEventDto.stig !== ''
    )
      throw new HttpException(
        'DISPOSAL_REASON_AND_STIG_CANNOT_BOTH_CONTAIN_VALUE',
        HttpStatus.BAD_REQUEST,
      );

    if (
      (updateChooseGiltEventDto.disposalReason == null ||
        updateChooseGiltEventDto.disposalReason == '') &&
      (updateChooseGiltEventDto.stig == null ||
        updateChooseGiltEventDto.stig == '')
    )
      throw new HttpException(
        'DISPOSAL_REASON_AND_STIG_CANNOT_BOTH_EMPTY',
        HttpStatus.BAD_REQUEST,
      );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const event = new EventEntity({
        personInCharge: updateChooseGiltEventDto.personInCharge || null,
        sbEndDate: updateChooseGiltEventDto.sbEndDate || null,
        disposalReason: updateChooseGiltEventDto.disposalReason,
      });
      queryRunner.manager.update(EventEntity, { id: eventId }, event);
      const pig = new PigInfoEntity({
        stig: updateChooseGiltEventDto.stig,
      });
      queryRunner.manager.update(
        PigInfoEntity,
        { id: eventinfo.pigInfo?.id, farmId: updateChooseGiltEventDto.farmId },
        pig,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException('GET_DATA_FAIL', HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllChooseGiltPigByGroup(
    exportChooseGiltsDto: ExportChooseGiltsDto,
  ): Promise<any> {
    try {
      const results =
        await this.chooseGiltReposotory.findPigChooseGiltByGroup(
          exportChooseGiltsDto,
        );
      return results.map((item) => this.toChooseGiltPig(item));
      //return this.toChooseGiltPig(results);
    } catch (error) {
      console.log(error);
      throw new HttpException('GET_LIST_FAIL', HttpStatus.BAD_REQUEST);
    }
  }
  async getChooseGilt(farmId: number, id: number) {
    return this.chooseGiltReposotory.getChooseGilt(farmId, id);
  }
  private toChooseGiltTicket(data: any): ChooseGiltTicketModel {
    const model: ChooseGiltTicketModel = new ChooseGiltTicketModel({
      id: data.id,
      ticketId: data.ticketid,
      eventDate: data.ticketdate || '',
      choiseNumber: Number(data.choisenumber || 0),
      rejectNumber: Number(data.rejectnumber || 0),
      createdBy: data.createdby,
    });
    return model;
  }
  private toChooseGiltPig(data: any): ExportChooseGiltsModel {
    const model: ExportChooseGiltsModel = new ExportChooseGiltsModel({
      id: data.id,
      tattoo: data.tattoo,
      gender: data.gender == 'M' ? 1 : 2,
    });
    return model;
  }
  private toChooseGiltEventModel(data: any): ChooseGiltEventModel {
    const model: ChooseGiltEventModel = new ChooseGiltEventModel({
      eventId: data.id || null,
      tattoo: data.pigInfo?.tattoo || '',
      geneticName: data.pigInfo?.genetic?.name || '',
      herdStat: data.pigInfo.herdStat.name || '',
      personInCharge: data.personInCharge || '',
      pic: data.pigInfo.pic || '',
      sbEndDate: data.sbEndDate || null,
      stig: data.pigInfo.stig || '',
      selectedBreed: data.selectedBreed,
      disposalReason: data.disposalReason || '',
      pigletGroupCode: data.pigInfo?.pigletGroupCode || '',
    });
    return model;
  }
  private async validateImportData(
    data: ChooseGiltsDto,
    listPigsChooseGilts: any,
    listPigs: any,
  ): Promise<any> {
    const mapPigs: any = new Map(
      listPigsChooseGilts.map((object: any) => {
        return [object.tattoo, true];
      }),
    );
    const mapStigPigs: any = new Map(
      listPigs.map((object: any) => {
        return [object.stig, true];
      }),
    );
    const errors = [];
    let numberOfRowError = 0;
    for (let index = 0; index < data.Pigs.length; index++) {
      let isRowError = 0;
      const element = data.Pigs[index];
      if (element.tattoo == null || element.tattoo == '') {
        const error = {
          row: index + 1,
          colum: 'TATTOO',
          message: 'TATTOO_CANNOT_EMPTY',
        };
        errors.push(error);
        isRowError++;
      }
      if (!isValidDate(element.endDate)) {
        const error = {
          row: index + 1,
          colum: 'END_DATE',
          message: 'END_DATE_IS_NOT_VALID_FORMAT',
        };
        errors.push(error);
        isRowError++;
      }
      if (element.sex != 1 && element.sex != 2) {
        const error = {
          row: index + 1,
          column: 'SEX',
          message: 'SEX_MUST_BE_1_OR_2',
        };
        errors.push(error);
        isRowError++;
      }
      if (
        (element.disposalReason == null || element.disposalReason == '') &&
        (element.stig == null || element.stig == '')
      ) {
        const error = {
          row: index + 1,
          column: 'DISPOSAL_REASON_AND_STIG',
          message: 'DISPOSAL_REASON_AND_STIG_CANNOT_BOTH_EMPTY',
        };
        errors.push(error);
        isRowError++;
      }
      if (
        element.disposalReason !== null &&
        element.disposalReason !== '' &&
        element.stig !== null &&
        element.stig !== ''
      ) {
        const error = {
          row: index + 1,
          column: 'DISPOSAL_REASON_AND_STIG',
          message: 'DISPOSAL_REASON_AND_STIG_CANNOT_BOTH_CONTAIN_VALUE',
        };
        errors.push(error);
        isRowError++;
      }
      if (!mapPigs.get(element.tattoo)) {
        const error = {
          row: index + 1,
          column: 'TATTOO',
          message: 'TATTOO_IS_NOT_FOUND',
        };
        errors.push(error);
        isRowError++;
      }
      if (mapStigPigs.get(element.stig)) {
        const error = {
          row: index + 1,
          column: 'STIG',
          message: 'STIG_IS_EXIST',
        };
        errors.push(error);
        isRowError++;
      }
      if (isRowError > 0) numberOfRowError++;
    }
    if (errors.length > 0) return { errors, numberOfRowError };
    return null;
  }
  private groupByProperty(arr: any, property: string): any {
    const items = arr.reduce(function (memo: any, x: any) {
      if (!memo[x[property]]) {
        memo[x[property]] = [];
      }
      memo[x[property]].push(x);
      return memo;
    }, {});
    return items;
  }
  private groupByTattoo(arr: any): any {
    const items = arr.reduce((r, { tattoo, ...rest }) => {
      const key = `${tattoo}`;
      r[key] = r[key] || {
        tattoo,
        pigs: [],
      };
      r[key]['pigs'].push(rest);
      return r;
    }, {});
    return Object.values(items);
  }
}
