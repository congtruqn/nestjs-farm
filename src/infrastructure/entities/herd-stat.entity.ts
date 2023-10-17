import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PigInfoEntity } from './pig-info.entity';
import { PigGroupEntity } from './pig-group.entity';
import { ReasonEntity } from './reason.entity';

@Entity('herd_stat')
export class HerdStatEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'code', type: 'varchar', length: 10 })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'name', type: 'varchar', length: 250 })
  description: string;

  @Column({ name: 'name', type: 'varchar', length: 2 })
  gender: string;

  @OneToMany(() => PigInfoEntity, (pigInfo) => pigInfo.herdStat)
  pigInfos: PigInfoEntity[];

  @OneToMany(() => PigGroupEntity, (pigInfo) => pigInfo.herdStat)
  pigGroups: PigGroupEntity[];

  @OneToMany(() => ReasonEntity, (pigEvent) => pigEvent.herdStat)
  reason: ReasonEntity[];
}
