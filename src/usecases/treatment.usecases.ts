import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import * as moment from 'moment';
import {
  ActionType,
  EventDefine,
  EventStatus,
} from 'src/domain/config/contants';
import { EventModel } from 'src/domain/model/choose-gilt.model';
import { DiseaseModel } from 'src/domain/model/disease.model';
import { IDiseaseRepository } from 'src/domain/repositories/diseaseRepository.interface';
import { IEventRepository } from 'src/domain/repositories/eventRepository.interface';
import { IEventTicketRepository } from 'src/domain/repositories/eventTicketRepository.interface';
import { IMedicineRepository } from 'src/domain/repositories/medicineRepository.interface';
import { IPigEventRepository } from 'src/domain/repositories/pigEventRepository.interface';
import { IPigInfoRepository } from 'src/domain/repositories/pigInfoRepository.interface';
import { ITreatmentRepository } from 'src/domain/repositories/treatmentRepository.interface';
import { CreateIndividualTreatmentDto } from 'src/dtos/treatment/create-individual-treatment.dto';
import {
  CreateSerialTreatmentDto,
  UpdateTreatmentDto,
} from 'src/dtos/treatment/create-serial-treatment.dto';
import {
  FindAllTreatmentEventsDto,
  FindTreatmentEventByPigDto,
} from 'src/dtos/treatment/find-all-events.dto';
import { FindAllSerialTreatmentDto } from 'src/dtos/treatment/find-all-serial-treatment.dto';
import { ImportTreatmentDto } from 'src/dtos/treatment/import-treatment.dto';
import { EventTicketEntity } from 'src/infrastructure/entities/event-ticket.entity';
import { EventEntity } from 'src/infrastructure/entities/event.entity';
import { PigEventEntity } from 'src/infrastructure/entities/pig-event.entity';
import {
  calculateSkip,
  groupByProperty,
  isNumeric,
  isValidDate,
} from 'src/utils/common';
import { generateTicket } from 'src/utils/generateTicketId';
import { DataSource } from 'typeorm';

export class TreatmentUseCases {
  constructor(
    @Inject('IDiseaseRepository')
    private readonly diseaseRepository: IDiseaseRepository,
    @Inject('IMedicineRepository')
    private readonly medicineRepository: IMedicineRepository,
    @Inject('IEventTicketRepository')
    private readonly eventTicketRepository: IEventTicketRepository,
    @Inject('IPigInfoRepository')
    private readonly pigInfoRepository: IPigInfoRepository,
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
    @Inject('IPigEventRepository')
    private readonly pigEventRepository: IPigEventRepository,
    @Inject('ITreatmentRepository')
    private readonly treatmentRepository: ITreatmentRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  async findAllDisease(): Promise<DiseaseModel[]> {
    return this.diseaseRepository.findAllDisease();
  }
  async createSerialTreatment(
    createSerialTreatmentDto: CreateSerialTreatmentDto,
  ): Promise<any> {
    //Create event ticket ID

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let eventStaus = EventStatus.save;
      if (createSerialTreatmentDto.createType == 5) {
        eventStaus = EventStatus.treatment;
      }
      for (const room of createSerialTreatmentDto.roomId) {
        const ticketId = await generateTicket(
          this.dataSource,
          EventDefine.treatment,
        );
        const eventTicket = new EventTicketEntity({
          medicineLot: createSerialTreatmentDto.medicineLot,
          ticketId: ticketId,
          eventDefineId: EventDefine.treatment,
          ticketDate: createSerialTreatmentDto.eventDate,
          blockId: createSerialTreatmentDto.blockId || null,
          houseId: createSerialTreatmentDto.houseId || null,
          roomId: room || null,
          eventDate: createSerialTreatmentDto.eventDate,
          diseaseId: createSerialTreatmentDto.diseaseId,
          createdBy: createSerialTreatmentDto.createdBy || '',
          penId: null,
          employee: createSerialTreatmentDto.employee || null,
          exportId: createSerialTreatmentDto.exportTicketId,
          medicineExpiry: createSerialTreatmentDto.medicineExpiry,
          actionType: ActionType.serials,
          eventStatusId: eventStaus,
          farmId: createSerialTreatmentDto.farmId,
          medicineId: createSerialTreatmentDto.medicineId,
        });
        const newEventTicket =
          this.eventTicketRepository.createEventTicket(eventTicket);
        await queryRunner.manager.save(EventTicketEntity, newEventTicket);
        if (createSerialTreatmentDto.createType == 5) {
          const pigByRoom = await this.pigInfoRepository.findPigbyRoom(
            room,
            createSerialTreatmentDto.farmId,
          );
          const listPigs = [];
          for (const element of pigByRoom) {
            const pigInfo = new EventEntity({
              createdBy: '',
              updatedBy: '',
              eventDate: createSerialTreatmentDto.eventDate,
              pigInfoId: element.id,
              eventTicketId: newEventTicket.id,
            });
            const newCauses = this.eventRepository.createEvent(pigInfo);
            listPigs.push(newCauses);
          }
          await queryRunner.manager.save(EventEntity, listPigs);
        }
      }
      await queryRunner.commitTransaction();
      return 'SUCCESS';
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException('CREATE_EVENT_FAIL', HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async importTreatment(data: ImportTreatmentDto): Promise<any> {
    const ImportPigs = groupByProperty(data.Pigs, 'stig');
    const importByTattoo = Object.entries(ImportPigs);

    const listStigs = [];
    importByTattoo.forEach(([key]) => {
      listStigs.push(key);
    });

    const [listMedicines, listDeseases, listPigs] = await Promise.all([
      this.medicineRepository.findAllMedicine(),
      this.diseaseRepository.findAllDisease(),
      this.pigInfoRepository.getAllPigsByStigs(data.farmId, listStigs),
    ]);

    const errors = await this.validateTreatmentData(
      data,
      listPigs,
      listDeseases,
      listMedicines,
    );
    if (errors) return errors;
    if (data.type == 1) return 'PASS';

    const mapImportPigs = new Map(
      listPigs.map((object: any) => {
        return [object.stig, object];
      }),
    );

    const mapDiseases = new Map(
      listDeseases.map((object: any) => {
        return [object.code, object];
      }),
    );

    const mapMedicines = new Map(
      listMedicines.map((object: any) => {
        return [object.code, object];
      }),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const listPigs = [];
      for (let index = 0; index < data.Pigs.length; index++) {
        // get PigInfo
        const pig = mapImportPigs.get(data.Pigs[index].stig);
        if (!pig)
          throw new HttpException(
            JSON.stringify({
              code: data.Pigs[index].stig,
              message: 'PIG_HAS_STIG_NOT_FOUND',
            }),
            HttpStatus.BAD_REQUEST,
          );

        const medicine = mapMedicines.get(data.Pigs[index].medicineCode);
        if (!medicine)
          throw new HttpException(
            JSON.stringify({
              code: data.Pigs[index].stig,
              message: 'PIG_MEDICINE_CODE_NOT_FOUND',
            }),
            HttpStatus.BAD_REQUEST,
          );

        const disease = mapDiseases.get(data.Pigs[index].diseaseCode);
        if (!disease)
          throw new HttpException(
            JSON.stringify({
              code: data.Pigs[index].stig,
              message: 'PIG_DISEASE_CODE_NOT_FOUND',
            }),
            HttpStatus.BAD_REQUEST,
          );

        const pigInfo = new PigEventEntity({
          createdBy: data.createdBy,
          pigInfoId: pig.id,
          eventDefineId: EventDefine.treatment,
          eventDate: moment(data.Pigs[index]?.eventDate, 'DD/MM/YYYY').toDate(),
          diseaseId: disease.id,
          medicineId: medicine.id,
          personInCharge: data.Pigs[index]?.personInCharge || '',
          comment1: data.Pigs[index]?.comment1 || '',
          comment2: data.Pigs[index]?.comment2 || '',
          eventStatusId: 5,
          medicineLot: data.Pigs[index]?.medicineLot || '',
          medicineExpiry: isValidDate(data.Pigs[index]?.medicineExpiry)
            ? moment(data.Pigs[index]?.medicineExpiry, 'DD/MM/YYYY').toDate()
            : null,
          exportId: data.Pigs[index]?.exportTicketId || '',
          quantity: Number(data.Pigs[index]?.quantity) || null,
        });
        const newEvent = this.pigEventRepository.createPigEvent(pigInfo);
        listPigs.push(newEvent);
      }
      await queryRunner.manager.save(PigEventEntity, listPigs);
      await queryRunner.commitTransaction();
      return 'SUCCESS';
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException('CREATE_EVENT_FAIL', HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async updateTreatment(
    id: number,
    farmId: number,
    updateSerialTreatmentDto: UpdateTreatmentDto,
  ): Promise<any> {
    const pigInfo = await this.pigInfoRepository.findOnePigInfoOptions({
      where: {
        stig: updateSerialTreatmentDto.stig,
        farmId: updateSerialTreatmentDto.farmId,
      },
    });

    if (!pigInfo) throw new BadRequestException('PIG_DOSE_NOT_EXIST');
    try {
      const data = new PigEventEntity({
        medicineLot: updateSerialTreatmentDto.medicineLot,
        eventDate: updateSerialTreatmentDto.eventDate,
        diseaseId: updateSerialTreatmentDto.diseaseId,
        updatedBy: updateSerialTreatmentDto.updatedBy || '',
        personInCharge: updateSerialTreatmentDto.employee || null,
        exportId: updateSerialTreatmentDto.exportTicketId,
        medicineExpiry: updateSerialTreatmentDto.medicineExpiry || null,
        medicineId: updateSerialTreatmentDto.medicineId,
        quantity: updateSerialTreatmentDto.quantity || 1,
        createdBy: updateSerialTreatmentDto.createdBy || '',
        eventStatusId: updateSerialTreatmentDto.createType,
        pigInfoId: pigInfo.id,
      });
      const result = await this.pigEventRepository.updatePigEvent(
        id,
        farmId,
        data,
      );
      if (!result || result.affected == 0)
        throw new HttpException('UPDATE_EVENT_FAIL', HttpStatus.BAD_REQUEST);
      return 'SUCCESS';
    } catch (error) {
      console.log(error);
      throw new HttpException('UPDATE_EVENT_FAIL', HttpStatus.BAD_REQUEST);
    }
  }

  async approveSerialTreatment(id: number, farmId: number): Promise<any> {
    const eventTicket =
      await this.eventTicketRepository.findOneEventTicketByOptions({
        where: { id },
        select: {
          id: true,
          eventStatusId: true,
          roomId: true,
          eventDate: true,
        },
      });

    if (!eventTicket) throw new BadRequestException('TICKET_DOSE_NOT_EXIST');
    if (eventTicket.eventStatusId != 4)
      throw new BadRequestException('THIS_TICKET_HAS_BEEN_INJECT_OR_DELETE');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(
        EventTicketEntity,
        { id: id, farmId: farmId },
        { eventStatusId: EventStatus.treatment },
      );

      const pigByRoom = await this.pigInfoRepository.findPigbyRoom(
        eventTicket.roomId,
        farmId,
      );
      const listPigs = [];
      for (const element of pigByRoom) {
        const pigInfo = new EventEntity({
          createdBy: '',
          updatedBy: '',
          eventDate: eventTicket.eventDate,
          pigInfoId: element.id,
          eventTicketId: id,
        });
        const newCauses = this.eventRepository.createEvent(pigInfo);
        listPigs.push(newCauses);
      }
      await queryRunner.manager.save(EventEntity, listPigs);

      await queryRunner.commitTransaction();
      return id;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException('CREATE_EVENT_FAIL', HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async approveTreatment(
    id: number,
    farmId: number,
    updatedBy: string,
  ): Promise<any> {
    try {
      const event = new PigEventEntity({
        updatedBy: updatedBy,
        eventStatusId: 5,
      });
      await this.pigEventRepository.updatePigEvent(id, farmId, event);
      return 'SUCCESS';
    } catch (error) {
      console.log(error);
      throw new HttpException('UPDATE_EVENT_FAIL', HttpStatus.BAD_REQUEST);
    }
  }

  async findAllSerialTreatment(
    farmId: number,
    findAllSerialTreatmentDto: FindAllSerialTreatmentDto,
  ) {
    const { pageNumber = 1, pageSize = 20 } = findAllSerialTreatmentDto;
    const [items, totalCount] =
      await this.eventTicketRepository.findAllSerialEventTicket(
        farmId,
        calculateSkip(pageNumber, pageSize),
        pageSize,
        findAllSerialTreatmentDto,
      );
    return {
      totalPage: Math.ceil(totalCount / pageSize),
      totalCount,
      items,
    };
  }

  async findAllTreatmentEvent(query: FindAllTreatmentEventsDto) {
    const { pageSize = 20 } = query;
    const [items, totalCount] =
      await this.treatmentRepository.findAllTreatmentEvents(query);
    return {
      totalPage: Math.ceil(totalCount / pageSize),
      totalCount,
      items,
    };
  }

  async getOneTreatmentEvent(farmId: number, eventId: number) {
    return await this.treatmentRepository.getOneTreatmentEvent(farmId, eventId);
  }

  async getTreatmentEventByPigInfo(
    pigInfoId: number,
    findTreatmentEventDto: FindTreatmentEventByPigDto,
  ) {
    const { pageSize = 20 } = findTreatmentEventDto;
    const [results, totalCount] =
      await this.treatmentRepository.findAllTreatmentEventsByPig(
        pigInfoId,
        findTreatmentEventDto,
      );
    return {
      totalPage: Math.ceil(totalCount / pageSize),
      totalCount,
      items: results.map((item) => this.toEventModel(item)),
    };
  }

  async getOneSerialTreatment(farmId: number, id: number) {
    return this.eventTicketRepository.getOneSerialEventTicket(farmId, id);
  }
  private toEventModel(data: any): EventModel {
    const model: EventModel = new EventModel({
      eventId: data.id,
      createdBy: data.createdBy || '',
      eventDate: data.eventDate || '',
      eventDefine: data.eventDefine?.name || '',
      ticketId: data.eventTicket?.ticketId || 0,
      diseaseName: data.eventTicket?.disease?.name || '',
      house: data.eventTicket.house?.name || '',
      room: data.eventTicket.room?.name || '',
      block: data.eventTicket.block?.name || '',
      medicineExpiry: data.eventTicket?.medicineExpiry || '',
      medicineLot: data.eventTicket?.medicineLot || '',
      exportId: data.eventTicket?.exportId || '',
    });
    return model;
  }

  private async validateTreatmentData(
    data: ImportTreatmentDto,
    listPigsChooseGilts: any,
    listDiseases: any,
    listMedicines: any,
  ): Promise<any> {
    const mapPigs: any = new Map(
      listPigsChooseGilts.map((object: any) => {
        return [object.stig, true];
      }),
    );

    const mapDiseases: any = new Map(
      listDiseases.map((object: any) => {
        return [object.code.toString(), true];
      }),
    );

    const mapMedicines: any = new Map(
      listMedicines.map((object: any) => {
        return [object.code.toString(), true];
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
      if (!mapPigs.get(element.stig)) {
        const error = {
          row: index + 1,
          column: 'STIG',
          message: 'STIG_IS_NOT_FOUND',
        };
        errors.push(error);
        isRowError++;
      }
      if (!mapDiseases.get(element.diseaseCode?.toString())) {
        const error = {
          row: index + 1,
          column: 'DISEASE_CODE',
          message: 'DISEASE_IS_NOT_FOUND',
        };
        errors.push(error);
        isRowError++;
      }
      if (!mapMedicines.get(element.medicineCode?.toString())) {
        const error = {
          row: index + 1,
          column: 'MEDICINE_CODE',
          message: 'MEDICINE_IS_NOT_FOUND',
        };
        errors.push(error);
        isRowError++;
      }
      if (
        !element.exportTicketId ||
        element.exportTicketId == null ||
        element.exportTicketId == ''
      ) {
        const error = {
          row: index + 1,
          colum: 'EXPORT_ID',
          message: 'EXPORT_ID_CANNOT_EMPTY',
        };
        errors.push(error);
        isRowError++;
      }
      if (!isValidDate(element.eventDate)) {
        const error = {
          row: index + 1,
          colum: 'EVENT_DATE',
          message: 'EVENT_DATE_IS_NOT_VALID_FORMAT',
        };
        errors.push(error);
        isRowError++;
      }
      if (
        !element.personInCharge ||
        element.personInCharge == null ||
        element.personInCharge == ''
      ) {
        const error = {
          row: index + 1,
          colum: 'PERSON_IN_CHARGE_ID',
          message: 'PERSON_IN_CHARGE_ID_CANNOT_EMPTY',
        };
        errors.push(error);
        isRowError++;
      }
      if (
        !element.quantity ||
        element.quantity == null ||
        element.quantity == '' ||
        !isNumeric(element.quantity)
      ) {
        const error = {
          row: index + 1,
          colum: 'QUANTITY',
          message: 'QUANTITY_CANNOT_EMPTY_OR_NOT_VALID',
        };
        errors.push(error);
        isRowError++;
      }
      if (isRowError > 0) numberOfRowError++;
    }
    if (errors.length > 0) return { errors, numberOfRowError };
    return null;
  }

  async createTreatment(data: CreateIndividualTreatmentDto) {
    try {
      const pigInfo = await this.pigInfoRepository.findOnePigInfoOptions({
        where: {
          stig: data.stig,
          farmId: data.farmId,
        },
      });

      if (!pigInfo) throw new BadRequestException('PIG_DOSE_NOT_EXIST');

      const event = new PigEventEntity({
        createdBy: data.createdBy,
        pigInfoId: pigInfo.id,
        eventDefineId: EventDefine.treatment,
        eventDate: data.eventDate,
        diseaseId: data.diseaseId,
        medicineId: data.medicineId,
        personInCharge: data.employee || '',
        eventStatusId: data.createType,
        medicineLot: data.medicineLot || '',
        medicineExpiry: data.medicineExpiry || null,
        exportId: data.exportId || '',
        quantity: data.quantity || 1,
      });
      const result = await this.pigEventRepository.savePigEvent(event);
      return result.id || 'SUCCESS';
    } catch (error) {
      console.log(error);
      throw new BadRequestException('CREATE_EVENT_FAIL');
    }
  }
}
