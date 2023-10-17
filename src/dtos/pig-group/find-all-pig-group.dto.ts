import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination.dto';
import { Transform } from 'class-transformer';

export class FindAllPigGroupDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Trại thái nhóm' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  @IsNumber({}, { each: true })
  readonly statusIds: number[];

  @ApiPropertyOptional({ description: 'HerdStat' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  @IsNumber({}, { each: true })
  readonly herdStatIds: number[];

  @ApiPropertyOptional({ description: 'Phòng' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  @IsNumber({}, { each: true })
  readonly roomId: number[];

  @ApiPropertyOptional({ description: 'Nhà' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  @IsNumber({}, { each: true })
  readonly houseId: number[];

  @ApiPropertyOptional({ description: 'Khu' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  @IsNumber({}, { each: true })
  readonly blockId: number[];
}
