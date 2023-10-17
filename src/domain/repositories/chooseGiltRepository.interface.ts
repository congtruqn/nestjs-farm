import { ExportChooseGiltsDto } from 'src/dtos/choose-gilt/export-choose-gilts.dto';
import {
  FindAllChooseGiltPigByTicketDto,
  FindAllChooseGiltPigsDto,
} from 'src/dtos/choose-gilt/find-all-choose-gilts.dto';
import { NeedChooseGiltsModel } from '../model/choose-gilt.model';

export interface IChooseGiltReposotory {
  findPigChooseGilt(
    findAllChooseGiltPigsDto: FindAllChooseGiltPigsDto,
  ): Promise<[any[], totalCount: number]>;
  findPigChooseGiltByGroup(
    exportChooseGiltsDto: ExportChooseGiltsDto,
  ): Promise<any[]>;
  getChooseGilt(farmId: number, id: number): Promise<any[]>;
  findChooseGiltPigsByTattoo(farmId: number, tattoo: string[]): Promise<any>;
  findPigChooseGiltByTicket(
    findAllChooseGiltPigByTicketDto: FindAllChooseGiltPigByTicketDto,
  ): Promise<[NeedChooseGiltsModel[] | any[], totalCount: number]>;
}
