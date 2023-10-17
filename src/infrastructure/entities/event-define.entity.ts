import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventTicketEntity } from './event-ticket.entity';
import { EventEntity } from './event.entity';
import { PigEventEntity } from './pig-event.entity';

@Entity('event_define')
export class EventDefineEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'code', type: 'varchar', length: 10 })
  code: string;

  @Column({ name: 'name', type: 'date' })
  name: Date;

  @Column({ name: 'serial_no', type: 'varchar', length: 5 })
  serialNo: string;

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status: string;

  @OneToMany(() => EventTicketEntity, (eventTicket) => eventTicket.eventDefine)
  eventTickets: EventTicketEntity[];

  @OneToMany(() => EventEntity, (events) => events.eventDefine)
  events: EventEntity[];

  @OneToMany(() => PigEventEntity, (events) => events.eventDefine)
  pigEvents: PigEventEntity[];
}
