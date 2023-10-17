import { IHeader } from '../commons.interface';
import { IPigGroup } from './pig-group.interface';

export interface IParamPigGroupImport {
  Items: IPigGroup[];
  FarmId: number;
}

export interface IPayloadPigGroupImport {
  Header: IHeader;
  Param: IParamPigGroupImport;
}
