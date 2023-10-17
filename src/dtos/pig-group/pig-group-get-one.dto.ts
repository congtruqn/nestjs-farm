import {
  IParamPigGroupGetOne,
  IPayloadPigGroupGetOne,
} from 'src/domain/interface/pig-group/pig-group-get-one.interface';

export class ParamPigGroupGetOneDto {
  id?: number;
  constructor(param: IParamPigGroupGetOne) {
    this.id = param.ID;
  }
}

export class PayloadPigGroupGetOneDto {
  param: ParamPigGroupGetOneDto;

  constructor(payload: IPayloadPigGroupGetOne) {
    this.param = new ParamPigGroupGetOneDto(payload.Param);
  }
}
