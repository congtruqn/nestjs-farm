import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPigInfoRepository } from 'src/domain/repositories/pigInfoRepository.interface';
import { FindOneOptions, ILike, In, Repository } from 'typeorm';
import { PigInfoEntity } from '../entities/pig-info.entity';
import { FindSowPigDto } from 'src/dtos/pregnancy-test/find-all-pregnancy-test-events.dto';
import { calculateSkip } from 'src/utils/common';
import { herdStat } from 'src/domain/config/contants';

@Injectable()
export class PigInfoRepository implements IPigInfoRepository {
  constructor(
    @InjectRepository(PigInfoEntity)
    private pigInfoRepository: Repository<PigInfoEntity>,
  ) {}

  async findPigbyRoom(roomId: number, farmId: number): Promise<any[]> {
    const result = await this.pigInfoRepository.find({
      where: {
        roomId: roomId,
        farmId: farmId,
      },
    });
    return result;
  }

  async findOnePigInfoOptions(options: FindOneOptions<PigInfoEntity>) {
    return this.pigInfoRepository.findOne(options);
  }

  async getAllPigsByStigs(farmId: number, stig: string[]): Promise<any[]> {
    return this.pigInfoRepository.find({
      where: {
        farmId: farmId,
        stig: In(stig),
        isRemove: false,
      },
      select: {
        id: true,
        stig: true,
        tattoo: true,
      },
    });
  }
  async getAllSow(query: FindSowPigDto): Promise<[any[], totalCount: number]> {
    const { pageNumber = 1, pageSize = 20 } = query;
    return this.pigInfoRepository.findAndCount({
      where: {
        farmId: query.farmId,
        isRemove: false,
        stig: ILike(`%${query.keyword || ''}%`),
        herdStatId: herdStat.InpigSow,
      },
      skip: calculateSkip(pageNumber, pageSize),
      take: pageSize,
      select: {
        id: true,
        stig: true,
        tattoo: true,
        herdStat: {},
      },
      relations: ['herdStat'],
    });
  }
}
