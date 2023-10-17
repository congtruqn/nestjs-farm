import { FindSowPigDto } from 'src/dtos/pregnancy-test/find-all-pregnancy-test-events.dto';
import { PigInfoEntity } from 'src/infrastructure/entities/pig-info.entity';
import { FindOneOptions } from 'typeorm';

export interface IPigInfoRepository {
  findPigbyRoom(roomId: number, farmId: number): Promise<any[]>;
  findOnePigInfoOptions(
    options: FindOneOptions<PigInfoEntity>,
  ): Promise<PigInfoEntity>;
  getAllPigsByStigs(farmId: number, stig: string[]): Promise<any[]>;
  getAllSow(query: FindSowPigDto): Promise<[any[], totalCount: number]>;
}
