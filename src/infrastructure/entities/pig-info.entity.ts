import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventEntity } from './event.entity';
import { GeneticEntity } from './genetic.entity';
import { HerdStatEntity } from './herd-stat.entity';
import { PigStatusEntity } from './pig-status.entity';
import { BlockEntity } from './block.entity';
import { HouseEntity } from './house.entity';
import { RoomEntity } from './room.entity';

@Entity('pig_info')
export class PigInfoEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'weaned_date', type: 'date' })
  weanedDate: Date;

  @Column({ name: 'tattoo', type: 'varchar', length: 20 })
  tattoo: string;

  @Column({ name: 'stig', type: 'varchar' })
  stig: string;

  @Column({ name: 'dob', type: 'timestamp with time zone' })
  dob: Date;

  @Column({ name: 'farm_id' })
  farmId: number;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updateBy: string;

  @Column({ name: 'dam', type: 'varchar', nullable: true })
  dam: string;

  @Column({ name: 'sire', type: 'varchar', nullable: true })
  sire: string;

  @ManyToOne(() => BlockEntity, (block) => block.pigInfos)
  @JoinColumn({ name: 'block_id', referencedColumnName: 'id' })
  block?: BlockEntity;

  @Column({ name: 'block_id', nullable: true })
  blockId: number;

  @ManyToOne(() => HouseEntity, (house) => house.pigInfos)
  @JoinColumn({ name: 'house_id', referencedColumnName: 'id' })
  house?: HouseEntity;

  @Column({ name: 'house_id', nullable: true })
  houseId: number;

  @ManyToOne(() => RoomEntity, (room) => room.pigInfos)
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room?: RoomEntity;

  @Column({ name: 'room_id', nullable: true })
  roomId: number;

  @Column({ name: 'pen_id', nullable: true })
  penId: number;

  @ManyToOne(() => PigStatusEntity, (pigStatusId) => pigStatusId.pigInfos)
  @JoinColumn({ name: 'pig_status_id' })
  pigStatus: PigStatusEntity;

  @ManyToOne(() => GeneticEntity, (gen) => gen.pigInfos)
  @JoinColumn({ name: 'genetic_id', referencedColumnName: 'pigTypeCode' })
  genetic: GeneticEntity;

  @Column({ name: 'genetic_id', type: 'varchar' })
  geneticId: string;

  @Column({ name: 'piglet_group_code', type: 'varchar' })
  pigletGroupCode: string;

  @Column({ name: 'gender', type: 'varchar' })
  gender: string;

  @Column({ name: 'is_remove', type: 'boolean' })
  isRemove: boolean;

  @Column({
    name: 'created_datetime',
    type: 'timestamp',
  })
  createDateTime: Date;

  @Column({
    name: 'updated_datetime',
    type: 'timestamp',
  })
  updateDateTime: Date;

  @ManyToOne(() => HerdStatEntity, (herdStat) => herdStat.pigInfos)
  @JoinColumn({ name: 'herd_stat_id', referencedColumnName: 'id' })
  herdStat?: HerdStatEntity;

  @Column({ name: 'herd_stat_id', nullable: true })
  herdStatId: number;

  @OneToMany(() => EventEntity, (event) => event.pigInfo)
  events: EventEntity[];

  @BeforeInsert()
  save() {
    const date = new Date();
    this.createDateTime = date;
    this.updateDateTime = date;
  }

  @BeforeUpdate()
  update() {
    this.updateDateTime = new Date();
  }
  constructor(partial: Partial<PigInfoEntity>) {
    Object.assign(this, partial);
  }
}
