import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UpdatePregnancyTestDto {
  @ApiPropertyOptional({ description: 'Nhân viên tạo phiếu' })
  @IsOptional()
  @MaxLength(100)
  createdBy: string;

  @ApiProperty({ description: 'Mã nguyên nhân', default: 65 })
  @IsNotEmpty()
  @IsNumber()
  readonly reason_id: number;

  @ApiPropertyOptional({ description: 'Người kiểm tra' })
  @IsOptional()
  @MaxLength(30, { message: 'EMPLOYEE_IS_TOO_LONG' })
  readonly inseminatorId: string;

  @ApiPropertyOptional({ description: 'ghi chú' })
  @IsOptional()
  @MaxLength(255, { message: 'NOTED_IS_TOO_LONG' })
  readonly noted: string;

  @ApiPropertyOptional({ description: '1 thủ công, 2 Siêu âm' })
  @IsOptional()
  @IsIn([1, 2], { message: 'CHECK_METHOD_MUST_BE_1_OR_2' })
  readonly checkMethod: number;

  @ApiPropertyOptional({ description: 'Ngày kiểm tra' })
  @IsOptional()
  @IsDateString()
  readonly testDate: Date;

  @ApiPropertyOptional({ description: 'Ngày xảy ra' })
  @IsOptional()
  @IsDateString()
  readonly servicefailedDate: Date;

  @ApiPropertyOptional({ description: 'ghi chú' })
  @IsOptional()
  @MaxLength(255, { message: 'COMMNET1_IS_TOO_LONG' })
  readonly comment1: string;

  @ApiPropertyOptional({ description: 'ghi chú' })
  @IsOptional()
  @MaxLength(255, { message: 'COMMNET2_IS_TOO_LONG' })
  readonly comment2: string;

  farmId: number;
}
