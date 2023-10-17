import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PigEventEntity } from './pig-event.entity';

@Entity('vaccine')
export class VaccineEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'herd_start_id', type: 'bigint' })
  herdStartId: number;

  @Column({ name: 'from_week', type: 'bigint' })
  fromWeek: number;

  @Column({ name: 'to_week', type: 'bigint' })
  toWeek: number;

  @Column({ name: 'code', type: 'varchar', length: 10 })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 250, nullable: true })
  description: string;

  // @OneToMany(() => PigEventEntity, (pigEvent) => pigEvent.vaccine)
  // pigEvents: PigEventEntity[];

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: false,
    nullable: true,
  })
  isActive: string;

  @Column({ name: 'dose', type: 'bigint', nullable: true })
  dose: string;
}
