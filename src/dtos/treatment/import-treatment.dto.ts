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

export class ImportTreatmentItemDto {
  @ApiPropertyOptional({ description: 'Thẻ tai', default: '427VY01O' })
  @IsOptional()
  readonly stig: string;

  @ApiPropertyOptional({ description: 'Mã phiếu xuất kho' })
  @IsOptional()
  @MaxLength(100, { message: 'EXPORT_ID_MAX_LENGTH_100_CHARACTERS' })
  readonly exportTicketId: string;

  @ApiPropertyOptional({ description: 'Mã loại bệnh', default: '06' })
  @IsOptional()
  readonly diseaseCode: string;

  @ApiPropertyOptional({ description: 'Mã thuốc điều khi', default: 'PCV' })
  @IsOptional()
  readonly medicineCode: string;

  @ApiPropertyOptional({ description: 'Lô thuốc' })
  @IsOptional()
  readonly medicineLot: string;

  @ApiPropertyOptional({ description: 'Hạn sử dụng' })
  @IsOptional()
  readonly medicineExpiry: string;

  @ApiPropertyOptional({ description: 'Ngày điều trị', default: '01/05/2023' })
  @IsOptional()
  readonly eventDate: string;

  @ApiPropertyOptional({ description: 'Số liều' })
  @IsOptional()
  readonly quantity: string;

  @ApiPropertyOptional({ description: 'Nhân viên điều trị' })
  @IsOptional()
  readonly personInCharge: string;

  @ApiPropertyOptional({ description: 'ghi chú' })
  @IsOptional()
  readonly comment1: string;

  @ApiPropertyOptional({ description: 'ghi chú' })
  @IsOptional()
  readonly comment2: string;
}

export class ImportTreatmentDto {
  @ApiProperty({ description: '1: validate, 2 import', default: 1 })
  @IsNotEmpty()
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
    type: ImportTreatmentItemDto,
  })
  @IsNotEmpty({ message: 'PIGS_IS_NOT_EMPTY' })
  @Type(() => ImportTreatmentItemDto)
  @ValidateNested({ each: true })
  @IsArray()
  readonly Pigs: ImportTreatmentItemDto[];

  farmId: number;
}
