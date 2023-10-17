import { PigGroupEntity } from 'src/infrastructure/entities/pig-group.entity';
import { FindManyOptions } from 'typeorm';
import { PigGroupModel } from '../model/pig-group.model';
import { FindAllPigGroupDto } from 'src/dtos/pig-group/find-all-pig-group.dto';
import { FindAllEventByPigGroupDto } from 'src/dtos/pig-group/find-all-events.dto';

export interface IPigGroupRepository {
  addPigGroup(data: PigGroupModel): Promise<PigGroupModel>;
  importPigGroup(data: PigGroupModel[]): Promise<boolean>;
  updatePigGroup(id: number, data: PigGroupModel): Promise<PigGroupModel>;
  deletePigGroup(id: number): Promise<PigGroupModel>;
  findOnePigGroup(id: number): Promise<PigGroupModel>;
  findAllPigGroupByOptions(
    options: FindManyOptions<PigGroupEntity>,
  ): Promise<PigGroupModel[]>;
  findAllAndCountPigGroup(
    farmId: number,
    findAllPigGroupDto: FindAllPigGroupDto,
  ): Promise<[PigGroupModel[], number]>;
  findAllEventByPigGroup(
    farmId: number,
    groupId: number,
    findAllEventByPigGroupDto: FindAllEventByPigGroupDto,
  ): Promise<any>;
}
