import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PigInfoEntity } from './pig-info.entity';
import { PigGroupEntity } from './pig-group.entity';

@Entity('genestic')
export class GeneticEntity {
  @PrimaryColumn({ name: 'pig_type_code', type: 'varchar', length: 10 })
  pigTypeCode: string;

  @Column({ name: 'name', type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 250 })
  description: string;

  @Column({ name: 'weight_ratio', type: 'int' })
  weightRatio: boolean;

  @Column({ name: 'generation', type: 'varchar', length: 10 })
  generation: number;

  @OneToMany(() => PigInfoEntity, (pigInfo) => pigInfo.genetic)
  pigInfos: PigInfoEntity[];

  @OneToMany(() => PigGroupEntity, (groupInfo) => groupInfo.genestic)
  pigGroups: PigGroupEntity[];
}
