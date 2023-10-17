import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination.dto';
import { Transform } from 'class-transformer';

export class QueryFindAllTreatmentIndividualDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Trại thái phiếu' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  readonly statusIds: number[];

  @ApiPropertyOptional({ description: 'Loại bệnh' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  readonly diseaseIds: number[];

  @ApiPropertyOptional({ description: 'HerdStat' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  readonly herdStatIds: number[];
}
