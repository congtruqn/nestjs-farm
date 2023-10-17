import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class ChooseGiltItemDto {
  @ApiProperty({ description: 'Xăm tai', default: '790VK139' })
  @IsNotEmpty()
  @IsString()
  readonly tattoo: string;

  @ApiProperty({ description: 'Giới tính', default: 1 })
  @IsNotEmpty()
  readonly sex: number;

  @ApiPropertyOptional({ description: 'Thẻ tai' })
  @IsOptional()
  readonly stig: string;

  @ApiPropertyOptional({ description: 'Nguyên nhân không chọn', default: '' })
  @IsOptional()
  readonly disposalReason: string;

  @ApiPropertyOptional({ description: 'Người thực hiện' })
  @IsOptional()
  readonly personInCharge: string;

  @ApiPropertyOptional({ description: 'Ngày chọn giống' })
  @IsOptional()
  readonly endDate: string;

  @ApiPropertyOptional({ description: 'Trọng lượng' })
  @IsOptional()
  @IsNumber()
  readonly endWT: number;

  @ApiPropertyOptional({ description: 'Điểm chân 1' })
  @IsOptional()
  @IsNumber()
  readonly scoreLeg1: number;

  @ApiPropertyOptional({ description: 'Điểm chân 2' })
  @IsOptional()
  @IsNumber()
  readonly scoreLeg2: number;

  @ApiPropertyOptional({ description: 'Điểm thể trạng' })
  @IsOptional()
  @IsNumber()
  readonly scoreMuscle: number;

  @ApiPropertyOptional({ description: 'Số vú trái tốt' })
  @IsOptional()
  @IsNumber()
  readonly teatsGoodL: number;

  @ApiPropertyOptional({ description: 'Số vú trái xấu' })
  @IsOptional()
  @IsNumber()
  readonly teatsBadL: number;

  @ApiPropertyOptional({ description: 'Số vú phải tốt' })
  @IsOptional()
  @IsNumber()
  readonly teatsGoodR: number;

  @ApiPropertyOptional({ description: 'Số vú phải xấu' })
  @IsOptional()
  @IsNumber()
  readonly teatsBadR: number;

  @ApiPropertyOptional({ description: 'Độ dày mỡ' })
  @IsOptional()
  @IsNumber()
  readonly alocaFat: number;

  @ApiPropertyOptional({ description: 'Độ dày cơ thăn' })
  @IsOptional()
  @IsNumber()
  readonly alocaMeat: number;

  @ApiPropertyOptional({ description: 'Index' })
  @IsOptional()
  @IsNumber()
  readonly index: number;
}

export class ChooseGiltsDto {
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
    type: ChooseGiltItemDto,
  })
  @IsNotEmpty({ message: 'PIGS_IS_NOT_EMPTY' })
  @Type(() => ChooseGiltItemDto)
  @ValidateNested({ each: true })
  @IsArray()
  readonly Pigs: ChooseGiltItemDto[];

  farmId: number;
}
