import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { IPigGroup } from 'src/domain/interface/pig-group/pig-group.interface';
import { regexDateString } from 'src/utils/common';

export class PigGroupDto {
  @IsString()
  @IsNotEmpty()
  groupId: string;

  @IsNumber()
  @Type(() => Number)
  groupType: number;

  @IsDateString()
  @Matches(regexDateString, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  birthDate: Date;

  @IsOptional()
  @IsString()
  registerId: string;

  @IsOptional()
  @IsString()
  origin: string;

  @IsOptional()
  @IsString()
  genetics: string;

  @IsOptional()
  @IsString()
  location: string;

  constructor(pigGroup: IPigGroup) {
    this.groupId = pigGroup.GroupId;
    this.groupType = pigGroup.GroupType;
    this.birthDate = pigGroup.Birthdate;
    this.registerId = pigGroup.RegisterId;
    this.origin = pigGroup.Origin;
    this.genetics = pigGroup.Genetics;
    this.location = pigGroup.Location;
  }
}
