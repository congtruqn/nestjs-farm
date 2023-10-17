import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IReasonRepository } from 'src/domain/repositories/reasonRepository.interface';
import { ReasonEntity } from '../entities/reason.entity';

@Injectable()
export class ReasonRepository implements IReasonRepository {
  constructor(
    @InjectRepository(ReasonEntity)
    private reasonRepository: Repository<ReasonEntity>,
  ) {}

  async findAllReason(): Promise<any[]> {
    return await this.reasonRepository.find({
      select: {
        id: true,
        nameVn: true,
      },
      where: {
        isActive: true,
      },
    });
  }

  async getPregnancyTestReason(): Promise<any[]> {
    return await this.reasonRepository.find({
      select: {
        id: true,
        nameVn: true,
      },
      where: {
        isActive: true,
        id: In([64, 65]),
      },
    });
  }
}
