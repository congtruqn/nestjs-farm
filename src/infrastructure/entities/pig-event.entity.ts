import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { PigInfoEntity } from './pig-info.entity';
import { EventDefineEntity } from './event-define.entity';
import { PigGroupEntity } from './pig-group.entity';
import { MedicineEntity } from './medicine.entity';
import { DiseaseEntity } from './disease.entity';
import { ReasonEntity } from './reason.entity';
import { EventStatusEntity } from './event-status.entity';

@Entity('pig_event')
export class PigEventEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'created_by', type: 'varchar', length: 20 })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', length: 20, nullable: true })
  updatedBy: string;

  @Column({
    name: 'event_date',
    type: 'timestamp with time zone',
  })
  eventDate: Date;

  @Column({ name: 'farm_id', nullable: true })
  farmId: number;

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

  @ManyToOne(() => EventDefineEntity, (event) => event.pigEvents)
  @JoinColumn({ name: 'event_define_id', referencedColumnName: 'id' })
  eventDefine?: EventDefineEntity;

  @Column({ name: 'event_define_id', nullable: true })
  eventDefineId: number;

  @Column({ name: 'selected_breed', nullable: true })
  selectedBreed: number;

  @Column({ name: 'person_in_charge', nullable: true })
  personInCharge: string;

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

  @ManyToOne(() => MedicineEntity, (medicine) => medicine.pigEvents)
  @JoinColumn({ name: 'medicine_id', referencedColumnName: 'id' })
  medicine?: MedicineEntity;

  @Column({ name: 'medicine_id', nullable: true })
  medicineId: number;

  // @ManyToOne(() => PigEventEntity, (medicine) => medicine.vaccine)
  // @JoinColumn({ name: 'vaccine_id', referencedColumnName: 'id' })
  // vaccine?: MedicineEntity;

  @ManyToOne(() => DiseaseEntity, (disease) => disease.pigEvents)
  @JoinColumn({ name: 'disease_id', referencedColumnName: 'id' })
  disease?: DiseaseEntity;

  @Column({ name: 'disease_id', nullable: true })
  diseaseId: number;

  @ManyToOne(() => ReasonEntity, (reason) => reason.pigEvents)
  @JoinColumn({ name: 'reason_id', referencedColumnName: 'id' })
  reason?: ReasonEntity;

  @Column({ name: 'reason_id', nullable: true })
  reasonId: number;

  @Column({ name: 'quantity', nullable: true })
  quantity: number;

  @ManyToOne(() => EventStatusEntity, (eventStatus) => eventStatus.pigEvents)
  @JoinColumn({ name: 'event_status_id', referencedColumnName: 'id' })
  eventStatus?: EventStatusEntity;

  @Column({ name: 'event_status_id', nullable: true })
  eventStatusId: number;

  @Column({ name: 'servicefailed_method', nullable: true })
  serviceFailedMethod: number;

  @Column({ name: 'servicefailed_date', nullable: true })
  serviceFailedDate: Date;

  @Column({ name: 'comment_1', nullable: true })
  comment1: string;

  @Column({ name: 'comment_2', nullable: true })
  comment2: string;

  @Column({ name: 'export_id', type: 'varchar', length: 20, nullable: true })
  exportId: string;

  @Column({ name: 'medicine_lot', type: 'varchar', length: 20, nullable: true })
  medicineLot: string;

  @Column({ name: 'medicine_expiry', type: 'timestamp', nullable: true })
  medicineExpiry: Date;

  @Column({ name: 'is_delete', type: 'boolean' })
  isDelete: boolean;

  constructor(partial: Partial<PigEventEntity>) {
    super();
    Object.assign(this, partial);
  }
}
