import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEventTicketDto {
  @ApiProperty({ description: 'Thẻ tai' })
  @IsNotEmpty()
  @IsString()
  readonly stig: string;

  @ApiProperty({ description: 'Phiếu xuất kho' })
  @IsNotEmpty()
  @IsString()
  readonly exportId: string;

  @ApiProperty({ description: 'Khu' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly blockCode: string;

  @ApiProperty({ description: 'Nhà' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly houseCode: string;

  @ApiProperty({ description: 'Phòng' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly roomCode: string;

  // @ApiProperty({ description: 'Loại bệnh' })
  // @IsNotEmpty()
  // @IsInt()
  // readonly diseaseId: number;

  // @ApiProperty({ description: 'Loại thuốc' })
  // @IsNotEmpty()
  // @IsInt()
  // readonly medicineId: number;

  @ApiProperty({ description: 'Ngày điều trị' })
  @IsNotEmpty()
  @IsString()
  readonly eventDate: Date;

  @ApiProperty({ description: 'Nhân viên điều trị' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly employee: string;

  @ApiProperty({ description: 'Số lô thuốc' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly medicineLot: string;

  @ApiProperty({ description: 'Hạn sử dụng' })
  @IsNotEmpty()
  @IsDateString()
  readonly medicineExpiry: Date;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsInt()
  // readonly eventDefineId: number;
}
