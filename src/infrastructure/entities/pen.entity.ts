import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventTicketEntity } from './event-ticket.entity';

@Entity('pen')
export class PenEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 250 })
  description: string;

  @OneToMany(() => EventTicketEntity, (eventTicket) => eventTicket.pen)
  eventTickets: EventTicketEntity[];
}
