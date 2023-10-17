import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateChooseGiltEventDto {
  @ApiPropertyOptional({ description: 'Thẻ tai' })
  @IsOptional()
  readonly stig: string;

  @ApiPropertyOptional({ description: 'Lý do không chọn giống' })
  @IsOptional()
  readonly disposalReason: string;

  @ApiPropertyOptional({ description: 'Ngày chọn giống' })
  @IsOptional()
  @IsDateString()
  readonly sbEndDate: Date;

  @ApiPropertyOptional({ description: 'Nhân viên chọn giống' })
  @IsOptional()
  personInCharge: string;

  farmId: number;
}
