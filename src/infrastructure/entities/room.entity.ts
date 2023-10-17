import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventTicketEntity } from './event-ticket.entity';
import { PigInfoEntity } from './pig-info.entity';

@Entity('room')
export class RoomEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 250 })
  description: string;

  @OneToMany(() => EventTicketEntity, (eventTicket) => eventTicket.room)
  eventTickets: EventTicketEntity[];

  @OneToMany(() => PigInfoEntity, (eventTicket) => eventTicket.room)
  pigInfos: PigInfoEntity[];
}
