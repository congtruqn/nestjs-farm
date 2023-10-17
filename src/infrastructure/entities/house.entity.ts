import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventTicketEntity } from './event-ticket.entity';
import { PigInfoEntity } from './pig-info.entity';
import { PigGroupEntity } from './pig-group.entity';

@Entity('house')
export class HouseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 250 })
  description: string;

  @OneToMany(() => EventTicketEntity, (eventTicket) => eventTicket.house)
  eventTickets: EventTicketEntity[];

  @OneToMany(() => PigInfoEntity, (eventTicket) => eventTicket.house)
  pigInfos: PigInfoEntity[];

  @OneToMany(() => PigGroupEntity, (eventTicket) => eventTicket.house)
  pigGroups: PigGroupEntity[];
}
