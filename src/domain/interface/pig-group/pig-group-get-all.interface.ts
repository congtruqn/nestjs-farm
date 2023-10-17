import { IHeader } from '../commons.interface';

export interface IPayloadQueuePigGroupGetAll {
  PageNumber?: number;

  PageSize?: number;
}

export interface IParamPigGroupGetAll {
  PageNumber?: number;

  PageSize?: number;

  Keyword?: string;
}

export interface IPayloadPigGroupGetAll {
  Header: IHeader;
  Param: IParamPigGroupGetAll;
}
