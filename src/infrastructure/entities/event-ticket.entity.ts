import { AutoMap } from '@automapper/classes';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { BlockEntity } from './block.entity';
import { DiseaseEntity } from './disease.entity';
import { EventDefineEntity } from './event-define.entity';
import { EventStatusEntity } from './event-status.entity';
import { EventEntity } from './event.entity';
import { FarmEntity } from './farm.entity';
import { HouseEntity } from './house.entity';
import { MedicineEntity } from './medicine.entity';
import { PenEntity } from './pen.entity';
import { RoomEntity } from './room.entity';

@Entity('event_ticket')
export class EventTicketEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @AutoMap()
  @Column({ name: 'ticket_id', type: 'varchar', length: 20 })
  ticketId: string;

  @Column({ name: 'ticket_date', type: 'date' })
  ticketDate: Date;

  @Column({ name: 'event_date', type: 'date' })
  eventDate: Date;

  @AutoMap()
  @Column({ name: 'created_by', type: 'varchar', length: 20 })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', length: 20, nullable: true })
  updatedBy: string;

  @Column({
    name: 'employee',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  employee: string;

  @Column({ name: 'export_id', type: 'varchar', length: 20, nullable: true })
  exportId: string;

  @Column({ name: 'medicine_lot', type: 'varchar', length: 20, nullable: true })
  medicineLot: string;

  @Column({ name: 'medicine_expiry', type: 'timestamp', nullable: true })
  medicineExpiry: Date;

  @Column({ name: 'action_type', type: 'bigint' })
  actionType: number;

  @ManyToOne(() => BlockEntity, (block) => block.eventTickets)
  @JoinColumn({ name: 'block_id', referencedColumnName: 'id' })
  block?: BlockEntity;

  @Column({ name: 'block_id', nullable: true })
  blockId: number;

  @ManyToOne(() => HouseEntity, (house) => house.eventTickets)
  @JoinColumn({ name: 'house_id', referencedColumnName: 'id' })
  house?: HouseEntity;

  @Column({ name: 'house_id', nullable: true })
  houseId: number;

  @ManyToOne(() => RoomEntity, (room) => room.eventTickets)
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room?: RoomEntity;

  @Column({ name: 'room_id', nullable: true })
  roomId: number;

  @ManyToOne(() => PenEntity, (pen) => pen.eventTickets)
  @JoinColumn({ name: 'pen_id', referencedColumnName: 'id' })
  pen?: PenEntity;

  @Column({ name: 'pen_id', nullable: true })
  penId: number;

  @ManyToOne(() => EventDefineEntity, (eventDefine) => eventDefine.eventTickets)
  @JoinColumn({ name: 'event_define_id', referencedColumnName: 'id' })
  eventDefine?: EventDefineEntity;

  @Column({ name: 'event_define_id', nullable: true })
  eventDefineId: number;

  @ManyToOne(() => EventStatusEntity, (eventStatus) => eventStatus.eventTickets)
  @JoinColumn({ name: 'event_status_id', referencedColumnName: 'id' })
  eventStatus?: EventStatusEntity;

  @Column({ name: 'event_status_id', nullable: true })
  eventStatusId: number;

  @ManyToOne(() => FarmEntity, (farm) => farm.eventTickets)
  @JoinColumn({ name: 'farm_id', referencedColumnName: 'id' })
  farm?: FarmEntity;

  @Column({ name: 'farm_id', nullable: true })
  farmId: number;

  @ManyToOne(() => MedicineEntity, (medicine) => medicine.eventTickets)
  @JoinColumn({ name: 'medicine_id', referencedColumnName: 'id' })
  medicine?: MedicineEntity;

  @Column({ name: 'medicine_id', nullable: true })
  medicineId: number;

  @ManyToOne(() => DiseaseEntity, (disease) => disease.eventTickets)
  @JoinColumn({ name: 'disease_id', referencedColumnName: 'id' })
  disease?: DiseaseEntity;

  @Column({ name: 'disease_id', nullable: true })
  diseaseId: number;

  @OneToMany(() => EventEntity, (eventTicket) => eventTicket.eventTicket)
  events?: EventEntity[];

  constructor(partial: Partial<EventTicketEntity>) {
    super();
    Object.assign(this, partial);
  }
}
