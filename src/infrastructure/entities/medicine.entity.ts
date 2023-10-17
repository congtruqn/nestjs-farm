import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventTicketEntity } from './event-ticket.entity';
import { PigEventEntity } from './pig-event.entity';

@Entity('medicines')
export class MedicineEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'herd_start_id', type: 'bigint', nullable: true })
  herdStartId: number;

  @Column({ name: 'from_week', type: 'bigint', nullable: true })
  fromWeek: number;

  @Column({ name: 'to_week', type: 'bigint', nullable: true })
  toWeek: number;

  @Column({ name: 'code', type: 'varchar', length: 10 })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 250, nullable: true })
  description: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({ name: 'dose', type: 'bigint', nullable: true })
  dose: string;

  @Column({ name: 'type', type: 'bigint' })
  type: number;

  @OneToMany(() => EventTicketEntity, (eventTicket) => eventTicket.medicine)
  eventTickets: EventTicketEntity[];

  @OneToMany(() => PigEventEntity, (pigEvent) => pigEvent.medicine)
  pigEvents: PigEventEntity[];
}
