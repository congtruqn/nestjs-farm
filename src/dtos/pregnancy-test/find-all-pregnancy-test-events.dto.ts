import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../pagination.dto';
import { IsArray, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
export class FindAllPregnancyTestEventDto extends PaginationDto {
  farmId: number;

  @ApiPropertyOptional({ description: 'Phòng' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  @IsNumber({}, { each: true })
  readonly roomIds: number[];

  @ApiPropertyOptional({ description: 'Nhà' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  @IsNumber({}, { each: true })
  readonly houseIds: number[];

  @ApiPropertyOptional({ description: 'Khu' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  @IsNumber({}, { each: true })
  readonly blockIds: number[];

  @ApiPropertyOptional({ description: 'Trạng thái mang thai' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  @IsNumber({}, { each: true })
  readonly reasonIds: number[];

  @ApiPropertyOptional({ description: 'Từ ngày' })
  @IsOptional()
  @IsDateString()
  readonly fromDate: Date;

  @ApiPropertyOptional({ description: 'Đến ngày' })
  @IsOptional()
  @IsDateString()
  readonly toDate: Date;
}
export class FindAllPregnancyTestEventByPigInfoDto extends PaginationDto {
  farmId: number;
  pigInfoId: number;
}

export class FindSowPigDto extends PaginationDto {
  farmId: number;
}
