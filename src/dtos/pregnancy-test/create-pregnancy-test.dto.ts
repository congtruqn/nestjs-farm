import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreatePregnancyTestDto {
  @ApiPropertyOptional({ description: 'Thẻ tai' })
  @IsOptional()
  @IsNotEmpty()
  readonly stig: string;

  @ApiPropertyOptional({ description: 'Mã nguyên nhân', default: 65 })
  @IsOptional()
  @IsNotEmpty()
  readonly reason: number;

  @ApiPropertyOptional({ description: 'Người kiểm tra' })
  @IsOptional()
  readonly inseminatorId: string;

  @ApiPropertyOptional({ description: '1 thủ công, 2 Siêu âm' })
  @IsOptional()
  readonly checkMethod: number;

  @ApiPropertyOptional({ description: 'Ngày kiểm tra' })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  readonly testDate: Date;

  @ApiPropertyOptional({ description: 'ghi chú' })
  @IsOptional()
  readonly comment1: string;

  @ApiPropertyOptional({ description: 'ghi chú' })
  @IsOptional()
  readonly comment2: string;

  @ApiPropertyOptional({ description: 'Ngày tạo phiếu' })
  @IsOptional()
  @IsDateString()
  readonly eventDate: Date;

  @ApiPropertyOptional({ description: 'Ngày xảy ra' })
  @IsOptional()
  @IsDateString()
  readonly servicefailedDate: Date;

  @ApiPropertyOptional({ description: 'Nhân viên tạo phiếu' })
  @IsOptional()
  @MaxLength(100)
  createdBy: string;
  farmId: number;
}
