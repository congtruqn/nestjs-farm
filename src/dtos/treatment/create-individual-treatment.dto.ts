import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateIndividualTreatmentDto {
  @ApiProperty({ description: 'Hành động Tạo hay là Tạo & Điều Trị' })
  @IsIn([4, 5])
  readonly createType: number;

  @ApiProperty({ description: 'Id Con Heo (chỗ thẻ tai á)' })
  @IsNotEmpty()
  readonly stig: string;

  @ApiProperty({ description: 'Số phiếu xuất kho' })
  @IsNotEmpty()
  readonly exportId: string;

  @ApiProperty({ description: 'Loại bệnh' })
  @IsNotEmpty()
  @IsInt()
  readonly diseaseId: number;

  @ApiPropertyOptional({ description: 'Loại thuốc điều trị' })
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  readonly medicineId: number;

  @ApiPropertyOptional({ description: 'Nhân viên điều trị' })
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(100)
  readonly employee: string;

  @ApiPropertyOptional({ description: 'Ngày điều trị' })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  readonly eventDate: Date;

  @ApiPropertyOptional({ description: 'Số lô thuốc' })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(20)
  readonly medicineLot: string;

  @ApiPropertyOptional({ description: 'Số liều' })
  @IsOptional()
  readonly quantity: number;

  @ApiPropertyOptional({ description: 'Hạn sử dụng thuốc' })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  readonly medicineExpiry: Date;

  readonly farmId: number;

  @ApiPropertyOptional({ description: 'Người tạo' })
  @IsOptional()
  readonly createdBy: string;
}

export class UpdateIndividualTreatmentDto extends CreateIndividualTreatmentDto {
  readonly updatedBy: string;
}
