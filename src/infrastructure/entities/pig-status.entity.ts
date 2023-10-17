import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PigGroupEntity } from './pig-group.entity';
import { PigInfoEntity } from './pig-info.entity';

@Entity('pig_status')
export class PigStatusEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'desciption', type: 'varchar', length: 250 })
  desciption: number;

  @Column({ name: 'status', type: 'int' })
  status: Date;

  @Column({ name: 'gender', type: 'varchar' })
  gender: number;

  @OneToMany(() => PigGroupEntity, (pigGroups) => pigGroups.pigStatus)
  pigGroups: PigGroupEntity[];

  @OneToMany(() => PigGroupEntity, (pigGroups) => pigGroups.pigStatus)
  pigInfos: PigInfoEntity[];
}
