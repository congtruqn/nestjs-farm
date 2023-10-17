import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

enum CREATETYPE {
  SAVE = 4,
  SAVE_AND_INJECT = 5,
}

export class CreateSerialTreatmentDto {
  @ApiProperty({ description: '4: SAVE, 5 SAVE & INJECT' })
  @IsNotEmpty({ message: 'CREATE_TYPE_IS_NOT_EMPTY' })
  @IsEnum(CREATETYPE)
  readonly createType: CREATETYPE;

  @ApiProperty()
  @IsNotEmpty({ message: 'EXPORT_ID_IS_NOT_EMPTY' })
  @MaxLength(100, { message: 'MAX_LENGTH_20_CHARACTERS' })
  readonly exportTicketId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'BLOCK_CODE_IS_NOT_EMPTY' })
  readonly blockId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'HOUSE_CODE_IS_NOT_EMPTY' })
  readonly houseId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'ROOM_CODE_IS_NOT_EMPTY' })
  @IsArray()
  readonly roomId: number[];

  @ApiProperty()
  @IsNotEmpty({ message: 'DISEASE_ID_IS_NOT_EMPTY' })
  readonly diseaseId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'EVENT_DATE_IS_NOT_EMPTY' })
  @IsDateString()
  readonly eventDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'MATERIAL_IS_NOT_EMPTY' })
  readonly medicineId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'EMPLOYEE_IS_NOT_EMPTY' })
  @MaxLength(100, { message: 'EMPLOYEE_MAX_LENGTH_100_CHARACTERS' })
  readonly employee: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(100, { message: 'MEDICINE_LOT_MAX_LENGTH_100_CHARACTERS' })
  readonly medicineLot: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readonly medicineExpiry: Date;

  farmId: number;
  createdBy: string;
}

export class UpdateSerialTreatmentDto {
  @ApiProperty({ description: 'Hành động Tạo hay là Tạo & Điều Trị' })
  @IsIn([4, 5])
  readonly createType: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'EXPORT_ID_IS_NOT_EMPTY' })
  @MaxLength(100, { message: 'MAX_LENGTH_20_CHARACTERS' })
  readonly exportTicketId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'BLOCK_CODE_IS_NOT_EMPTY' })
  readonly blockId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'HOUSE_CODE_IS_NOT_EMPTY' })
  readonly houseId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'ROOM_CODE_IS_NOT_EMPTY' })
  readonly roomId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'DISEASE_ID_IS_NOT_EMPTY' })
  readonly diseaseId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'EVENT_DATE_IS_NOT_EMPTY' })
  @IsDateString()
  readonly eventDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'MATERIAL_IS_NOT_EMPTY' })
  readonly medicineId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'EMPLOYEE_IS_NOT_EMPTY' })
  @MaxLength(100, { message: 'EMPLOYEE_MAX_LENGTH_100_CHARACTERS' })
  readonly employee: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(100, { message: 'MEDICINE_LOT_MAX_LENGTH_100_CHARACTERS' })
  readonly medicineLot: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readonly medicineExpiry: Date;

  @ApiPropertyOptional({ description: 'Số liều' })
  @IsOptional()
  readonly quantity: number;

  farmId: number;
  updatedBy: string;

  @ApiPropertyOptional()
  @IsOptional()
  createdBy: string;
}

export class UpdateTreatmentDto {
  @ApiProperty({ description: 'Hành động Tạo hay là Tạo & Điều Trị' })
  @IsIn([4, 5])
  readonly createType: number;

  @ApiProperty({ description: 'Id Con Heo (chỗ thẻ tai á)' })
  @IsNotEmpty()
  readonly stig: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'EXPORT_ID_IS_NOT_EMPTY' })
  @MaxLength(100, { message: 'MAX_LENGTH_20_CHARACTERS' })
  readonly exportTicketId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'DISEASE_ID_IS_NOT_EMPTY' })
  readonly diseaseId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'EVENT_DATE_IS_NOT_EMPTY' })
  @IsDateString()
  readonly eventDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'MATERIAL_IS_NOT_EMPTY' })
  readonly medicineId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'EMPLOYEE_IS_NOT_EMPTY' })
  @MaxLength(100, { message: 'EMPLOYEE_MAX_LENGTH_100_CHARACTERS' })
  readonly employee: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(100, { message: 'MEDICINE_LOT_MAX_LENGTH_100_CHARACTERS' })
  readonly medicineLot: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readonly medicineExpiry: Date;

  @ApiPropertyOptional({ description: 'Số liều' })
  @IsOptional()
  readonly quantity: number;

  farmId: number;
  updatedBy: string;

  @ApiPropertyOptional()
  @IsOptional()
  createdBy: string;
}
