import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination.dto';
import { Transform, Type } from 'class-transformer';

export class FindAllSerialTreatmentDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Trại thái phiếu' })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @Transform(({ value }) => value.toString().split(',').map(Number))
  @IsInt({ each: true })
  readonly statusIds: number[];

  @ApiPropertyOptional({ description: 'Loại bệnh' })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @Transform(({ value }) => value.toString().split(',').map(Number))
  @IsInt({ each: true })
  readonly diseaseIds: number[];

  @ApiPropertyOptional({ description: 'HerdStat' })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @Transform(({ value }) => value.toString().split(',').map(Number))
  @IsInt({ each: true })
  readonly herdStatIds: number[];
}
