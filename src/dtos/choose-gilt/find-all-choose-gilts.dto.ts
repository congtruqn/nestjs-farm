import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaginationDto } from '../pagination.dto';

import { ChooseGiltType } from 'src/domain/config/contants';
import { Transform } from 'class-transformer';

export class FindAllChooseGiltPigsDto extends PaginationDto {
  farmId: number;
}
export class FindAllChooseGiltPigByTicketDto extends PaginationDto {
  @ApiProperty({ description: '1: Được chọn, 2: Từ chối' })
  @IsNotEmpty({ message: 'TYPE_IS_NOT_EMPTY' })
  @Transform((params) => (params.value ? Number(params.value) : 1))
  @IsEnum(ChooseGiltType)
  readonly type: ChooseGiltType;

  farmId: number;
  ticketId: number;
}
export class FindAllChooseGiltTicketDto extends PaginationDto {
  readonly farmId: number;
}
