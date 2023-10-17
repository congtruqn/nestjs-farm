import { IHeader } from '../commons.interface';

export interface IParamPigGroupGetOne {
  ID?: number;
}

export interface IPayloadPigGroupGetOne {
  Header: IHeader;
  Param: IParamPigGroupGetOne;
}
