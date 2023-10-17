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
import { PigStatusEntity } from './pig-status.entity';
import { BlockEntity } from './block.entity';
import { HouseEntity } from './house.entity';
import { RoomEntity } from './room.entity';
import { GeneticEntity } from './genetic.entity';
import { HerdStatEntity } from './herd-stat.entity';
import { EventEntity } from './event.entity';

@Entity('pig_group')
export class PigGroupEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'group_id', type: 'varchar' })
  groupId: string;

  @Column({ name: 'group_type', type: 'integer' })
  groupType: number;

  @Column({ name: 'birthdate', type: 'date' })
  birthDate: Date;

  @Column({ name: 'inventory', type: 'integer', default: 0 })
  inventory: number;

  @Column({ name: 'register_id', type: 'varchar', nullable: true })
  registerId: string;

  @Column({ name: 'origin', type: 'varchar', nullable: true })
  origin: string;

  @Column({ name: 'farm_id' })
  farmId: number;

  @Column({ name: 'isactive' })
  isActive: boolean;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updateBy: string;

  @Column({ type: 'integer', default: 0 })
  status: number;

  @Column({ type: 'integer', default: 0, name: 'remove_quantity_in_group' })
  removeQuantityInGroup: number;

  @Column({ type: 'integer', default: 0, name: 'total_weight' })
  totalWeight: number;

  @Column({ type: 'integer', default: 0, name: 'average_weight' })
  averageWeight: number;

  @Column({ type: 'integer', default: 0, name: 'in_week' })
  inWeek: number;

  @Column({ type: 'integer', default: 0, name: 'birth_week' })
  birthWeek: number;

  @Column({ type: 'integer', default: 0, name: 'standard_quantity_in_group' })
  standardQuantityInGroup: number;

  @ManyToOne(() => PigStatusEntity, (pigStatusId) => pigStatusId.pigGroups)
  @JoinColumn({ name: 'pig_status_id' })
  pigStatus: PigStatusEntity;

  @Column({ name: 'pig_status_id', nullable: true })
  pigStatusId: number;

  @Column({ name: 'received_date', nullable: true })
  receivedDate: Date;

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

  @ManyToOne(() => GeneticEntity, (gen) => gen.pigGroups)
  @JoinColumn({ name: 'genetic_id', referencedColumnName: 'pigTypeCode' })
  genestic: GeneticEntity;

  @ManyToOne(() => HerdStatEntity, (herdStat) => herdStat.pigGroups)
  @JoinColumn({ name: 'herd_stat_id', referencedColumnName: 'id' })
  herdStat?: HerdStatEntity;

  @Column({ name: 'herd_stat_id', nullable: true })
  herdStatId: number;

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

  @OneToMany(() => EventEntity, (event) => event.pigGroups)
  events: EventEntity[];

  @BeforeInsert()
  save() {
    const date = new Date();
    this.createDateTime = date;
    this.updateDateTime = date;
    this.inventory = 0;
    this.status = 0;
    this.isActive = false;
  }

  @BeforeUpdate()
  update() {
    this.updateDateTime = new Date();
  }
}
