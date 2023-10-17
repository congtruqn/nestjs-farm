import { EventTicketEntity } from 'src/infrastructure/entities/event-ticket.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import {
  DetailTreatmentModel,
  ListSerialTreatmentModel,
} from '../model/treatment.model';
import { FindAllSerialTreatmentDto } from 'src/dtos/treatment/find-all-serial-treatment.dto';
import { FindAllChooseGiltTicketDto } from 'src/dtos/choose-gilt/find-all-choose-gilts.dto';

export interface IEventTicketRepository {
  createEventTicket(data: EventTicketEntity): EventTicketEntity;
  updateEventTicket(
    id: number,
    data: EventTicketEntity,
  ): Promise<EventTicketEntity>;
  findAllEventTicketByOptions(
    options: FindManyOptions<EventTicketEntity>,
  ): Promise<any[]>;
  findAllAndCountEventTicketByOptions(
    options?: FindManyOptions<EventTicketEntity>,
  ): Promise<[EventTicketEntity[], number]>;
  findOneEventTicketByOptions(
    options?: FindOneOptions<EventTicketEntity>,
  ): Promise<EventTicketEntity>;
  findAllSerialEventTicket(
    farm_id: number,
    skip: number,
    take: number,
    findAllSerialTreatmentDto: FindAllSerialTreatmentDto,
  ): Promise<[ListSerialTreatmentModel[], totalCount: number]>;
  getOneSerialEventTicket(
    farm_id: number,
    id: number,
  ): Promise<DetailTreatmentModel>;

  findAllChooseGiltTicket(
    farmId: number,
    findAllChooseGiltTicketDto: FindAllChooseGiltTicketDto,
  ): Promise<[any[], totalCount: number]>;
  getChooseGiltTicket(farmId: number, id: number): Promise<any>;
}
