import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventTicketEntity } from './event-ticket.entity';
import { PigInfoEntity } from './pig-info.entity';
import { PigGroupEntity } from './pig-group.entity';

@Entity('block')
export class BlockEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 250 })
  description: string;

  @OneToMany(() => EventTicketEntity, (eventTicket) => eventTicket.block)
  eventTickets: EventTicketEntity[];

  @OneToMany(() => PigInfoEntity, (eventTicket) => eventTicket.block)
  pigInfos: PigInfoEntity[];

  @OneToMany(() => PigGroupEntity, (eventTicket) => eventTicket.block)
  pigGroups: PigGroupEntity[];
}
