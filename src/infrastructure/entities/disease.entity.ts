import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventTicketEntity } from './event-ticket.entity';
import { AutoMap } from '@automapper/classes';
import { PigEventEntity } from './pig-event.entity';

@Entity('disease')
export class DiseaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @AutoMap()
  @Column({ name: 'code', type: 'varchar', length: 10 })
  code: string;

  @AutoMap()
  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @AutoMap()
  @Column({ name: 'description', type: 'varchar', length: 250 })
  description: string;

  @AutoMap()
  @Column({ name: 'is_active', type: 'bool' })
  isActive: boolean;

  @AutoMap()
  @Column({ name: 'group_id', type: 'int' })
  groupId: number;

  @OneToMany(() => EventTicketEntity, (eventTicket) => eventTicket.disease)
  eventTickets: EventTicketEntity[];

  @OneToMany(() => PigEventEntity, (pigEvent) => pigEvent.disease)
  pigEvents: PigEventEntity[];
}
