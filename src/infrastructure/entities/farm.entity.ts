import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventTicketEntity } from './event-ticket.entity';

@Entity('farm')
export class FarmEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'farm_type', type: 'varchar', length: 50 })
  farmType: string;

  @Column({ name: 'code', type: 'varchar', length: 10, nullable: true })
  code: string;

  @Column({ name: 'name', type: 'bigint' })
  capacity: number;

  @Column({ name: 'description', type: 'varchar', length: 250 })
  description: string;

  @Column({ name: 'address', type: 'varchar', length: 250 })
  address: string;

  @Column({ name: 'country_code', type: 'varchar', length: 10 })
  countryCode: string;

  @Column({ name: 'country_name', type: 'varchar', length: 50 })
  countryName: string;

  @Column({ name: 'province_code', type: 'varchar', length: 10 })
  provinceCode: string;

  @Column({ name: 'province_name', type: 'varchar', length: 250 })
  provinceName: string;

  @Column({ name: 'legal_code', type: 'varchar', length: 10 })
  legalCode: string;

  @Column({ name: 'legal_name', type: 'varchar', length: 250 })
  legalName: string;

  @Column({ name: 'bu', type: 'varchar', length: 50 })
  bu: string;

  @Column({ name: 'area_code', type: 'varchar', length: 50 })
  areaCode: string;

  @Column({ name: 'area_name', type: 'varchar', length: 50 })
  areaName: string;

  @OneToMany(() => EventTicketEntity, (eventTicket) => eventTicket.farm)
  eventTickets: EventTicketEntity[];
}
