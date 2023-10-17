import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventTicketEntity } from './event-ticket.entity';
import { PigEventEntity } from './pig-event.entity';

@Entity('event_status')
export class EventStatusEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 120, nullable: true })
  name: string;

  @OneToMany(() => EventTicketEntity, (eventTicket) => eventTicket.eventStatus)
  eventTickets: EventTicketEntity[];

  @OneToMany(() => PigEventEntity, (events) => events.eventStatus)
  pigEvents: PigEventEntity[];
}
