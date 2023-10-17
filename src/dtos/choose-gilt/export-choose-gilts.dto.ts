import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';

export class ExportChooseGiltsDto {
  @ApiProperty({ description: 'Xăm tai cần export' })
  @IsNotEmpty({ message: 'TATTOO_IS_NOT_EMPTY' })
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(String))
  readonly tattoo: string[];

  farmId: number;
}
