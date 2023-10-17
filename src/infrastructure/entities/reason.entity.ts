import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PigEventEntity } from './pig-event.entity';
import { HerdStatEntity } from './herd-stat.entity';

@Entity('reason')
export class ReasonEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'code', type: 'varchar', length: 10 })
  code: string;

  @Column({ name: 'name_vn', type: 'varchar', length: 50 })
  nameVn: string;

  @Column({ name: 'name_eng', type: 'varchar', length: 50 })
  nameEng: string;

  @Column({ name: 'description', type: 'varchar', length: 250 })
  description: string;

  @Column({ name: 'is_active', type: 'bool' })
  isActive: boolean;

  @ManyToOne(() => HerdStatEntity, (herdStat) => herdStat.reason)
  @JoinColumn({ name: 'herd_stat_id', referencedColumnName: 'id' })
  herdStat?: HerdStatEntity;

  @Column({ name: 'herd_stat_id', nullable: true })
  herdStatId: number;

  @Column({ name: 'categorize', type: 'varchar' })
  categorize: string;

  @OneToMany(() => PigEventEntity, (pigEvent) => pigEvent.reason)
  pigEvents: PigEventEntity[];
}
