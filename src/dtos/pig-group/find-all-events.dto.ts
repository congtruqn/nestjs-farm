import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaginationDto } from '../pagination.dto';
import { Transform } from 'class-transformer';
import { EventDefine } from 'src/domain/config/contants';

export class FindAllEventByPigGroupDto extends PaginationDto {
  @ApiProperty({
    description: '0: Tất cả, 2: Vaccine,  3: Điều trị, 5 Chọn giống',
  })
  @IsNotEmpty({ message: 'TYPE_IS_NOT_EMPTY' })
  @Transform((params) => (params.value ? Number(params.value) : 0))
  @IsEnum(EventDefine)
  readonly type: EventDefine;

  farmId: number;
  ticketId: number;
}
