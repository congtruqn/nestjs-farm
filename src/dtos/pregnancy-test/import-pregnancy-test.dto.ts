import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class PregnancyTestDto {
  @ApiPropertyOptional({ description: 'Thẻ tai' })
  @IsOptional()
  readonly stig: string;

  @ApiPropertyOptional({ description: 'Mã nguyên nhân', default: '65' })
  @IsOptional()
  readonly reason: string;

  @ApiPropertyOptional({ description: 'Người kiểm tra' })
  @IsOptional()
  readonly inseminatorId: string;

  @ApiPropertyOptional({ description: 'ghi chú' })
  @IsOptional()
  readonly noted: string;

  @ApiPropertyOptional({ description: '1 thủ công, 2 Siêu âm' })
  @IsOptional()
  readonly checkMethod: number;

  @ApiPropertyOptional({ description: 'Ngày kiểm tra' })
  @IsOptional()
  readonly testDate: string;

  @ApiPropertyOptional({ description: 'ghi chú' })
  @IsOptional()
  readonly comment1: string;

  @ApiPropertyOptional({ description: 'ghi chú' })
  @IsOptional()
  readonly comment2: string;
}

export class ImportPregnancyTestDto {
  @ApiProperty({ description: '1: validate, 2 import', default: 1 })
  @IsIn([1, 2])
  readonly type: number;

  @ApiPropertyOptional({ description: 'Ngày tạo phiếu' })
  @IsOptional()
  @IsDateString()
  readonly eventDate: Date;

  @ApiPropertyOptional({ description: 'Nhân viên tạo phiếu' })
  @IsOptional()
  @MaxLength(100)
  createdBy: string;

  @ApiProperty({
    isArray: true,
    type: PregnancyTestDto,
  })
  @IsNotEmpty({ message: 'PIGS_IS_NOT_EMPTY' })
  @Type(() => PregnancyTestDto)
  @ValidateNested({ each: true })
  @IsArray()
  readonly Pigs: PregnancyTestDto[];

  farmId: number;
}
