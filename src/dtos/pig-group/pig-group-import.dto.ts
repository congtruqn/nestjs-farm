import {
  IParamPigGroupImport,
  IPayloadPigGroupImport,
} from 'src/domain/interface/pig-group/pig-group-import.interface';
import { PigGroupDto } from './pig-group.dto';

export class ParamPigGroupImportDto {
  items: PigGroupDto[];
  farmId: number;

  constructor(param: IParamPigGroupImport) {
    this.items = param.Items.map((item) => new PigGroupDto(item));
    this.farmId = param.FarmId;
  }
}

export class PayloadPigGroupImportDto {
  param: ParamPigGroupImportDto;

  constructor(payload: IPayloadPigGroupImport) {
    this.param = new ParamPigGroupImportDto(payload.Param);
  }
}
