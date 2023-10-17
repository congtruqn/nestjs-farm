import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { EventTicketEntity } from './event-ticket.entity';
import { PigInfoEntity } from './pig-info.entity';
import { EventDefineEntity } from './event-define.entity';
import { PigGroupEntity } from './pig-group.entity';

@Entity('event')
export class EventEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'comment', type: 'varchar', length: 255, nullable: true })
  comment: string;

  @Column({ name: 'created_by', type: 'varchar', length: 20 })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', length: 20, nullable: true })
  updatedBy: string;

  @Column({
    name: 'event_date',
    type: 'timestamp with time zone',
  })
  eventDate: Date;

  @ManyToOne(() => PigInfoEntity, (pigInfo) => pigInfo.events)
  @JoinColumn({ name: 'pig_info_id', referencedColumnName: 'id' })
  pigInfo: PigInfoEntity;

  @Column({ name: 'pig_info_id' })
  pigInfoId: number;

  @ManyToOne(() => PigGroupEntity, (pigInfo) => pigInfo.events)
  @JoinColumn({ name: 'pig_group_id', referencedColumnName: 'id' })
  pigGroups: PigGroupEntity;

  @Column({ name: 'pig_group_id' })
  pigGroupId: number;

  @ManyToOne(() => EventDefineEntity, (event) => event.events)
  @JoinColumn({ name: 'event_define_id', referencedColumnName: 'id' })
  eventDefine?: EventDefineEntity;

  @Column({ name: 'event_define_id', nullable: true })
  eventDefineId: number;

  @ManyToOne(() => EventTicketEntity, (eventTicket) => eventTicket.events)
  @JoinColumn({
    name: 'event_ticket_id',
    referencedColumnName: 'id',
  })
  eventTicket: EventTicketEntity;

  @Column({ name: 'event_ticket_id', nullable: true })
  eventTicketId: number;

  @Column({ name: 'selected_breed', nullable: true })
  selectedBreed: number;

  @Column({ name: 'person_in_charge', nullable: true })
  personInCharge: string;

  @Column({ name: 'reason_id', nullable: true })
  disposalReason: string;

  @Column({ name: 'sb_end_wt', nullable: true })
  sbEndWt: number;

  @Column({ name: 'sb_score_legs_01', nullable: true })
  sbScoreLegs01: number;

  @Column({ name: 'sb_score_legs_02', nullable: true })
  sbScoreLegs02: number;

  @Column({ name: 'sb_score_muscle', nullable: true })
  sbScoreMuscle: number;

  @Column({ name: 'sb_teats_good_l', nullable: true })
  sbTeatsGoodL: number;

  @Column({ name: 'sb_teats_bad_l', nullable: true })
  sbTeatsBadL: number;

  @Column({ name: 'sb_teats_bad_r', nullable: true })
  sbTeatsBadR: number;

  @Column({ name: 'sb_teats_good_r', nullable: true })
  sbTeatsGoodR: number;

  @Column({ name: 'sb_aloca_fat', nullable: true })
  sbAlocaFat: number;

  @Column({ name: 'sb_aloca_meat', nullable: true })
  sbAlocaMeat: number;

  @Column({ name: 'sb_index', nullable: true })
  sbIndex: number;

  @Column({ name: 'sb_end_date', nullable: true })
  sbEndDate: Date;

  constructor(partial: Partial<EventEntity>) {
    super();
    Object.assign(this, partial);
  }
}
