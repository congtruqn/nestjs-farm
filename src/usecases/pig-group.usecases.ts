import { Inject } from '@nestjs/common';
import { EventModel } from 'src/domain/model/choose-gilt.model';
import { PigGroupModel } from 'src/domain/model/pig-group.model';
import { IPigGroupRepository } from 'src/domain/repositories/pigGroupRepository.interface';
import { FindAllEventByPigGroupDto } from 'src/dtos/pig-group/find-all-events.dto';
import { FindAllPigGroupDto } from 'src/dtos/pig-group/find-all-pig-group.dto';
import { PigGroupEntity } from 'src/infrastructure/entities/pig-group.entity';
import { FindManyOptions } from 'typeorm';

export class PigGroupUseCases {
  constructor(
    @Inject('IPigGroupRepository')
    private readonly groupRepository: IPigGroupRepository,
  ) {}

  async addPigGroup(data: PigGroupModel) {
    return this.groupRepository.addPigGroup(data);
  }

  async updatePigGroup(id: number, data: PigGroupModel) {
    return this.groupRepository.updatePigGroup(id, data);
  }

  async importPigGroup(data: PigGroupModel[]) {
    return this.groupRepository.importPigGroup(data);
  }

  async deletePigGroup(id: number) {
    return this.groupRepository.deletePigGroup(id);
  }

  async findOnePigGroup(id: number) {
    return await this.groupRepository.findOnePigGroup(id);
  }

  async findAllEvent(
    FarmId: number,
    pigGroupId: number,
    findAllEventByPigGroupDto: FindAllEventByPigGroupDto,
  ) {
    const { pageSize = 20 } = findAllEventByPigGroupDto;
    const [results, totalCount] =
      await this.groupRepository.findAllEventByPigGroup(
        FarmId,
        pigGroupId,
        findAllEventByPigGroupDto,
      );

    return {
      totalPage: Math.ceil(totalCount / pageSize),
      totalCount,
      items: results.map((item) => this.toEventModel(item)),
    };
  }

  async findAllPigGroupByOptions(
    options: FindManyOptions<PigGroupEntity> = {},
  ): Promise<PigGroupModel[]> {
    return this.groupRepository.findAllPigGroupByOptions(options);
  }

  async findAllAndCountPigGroup(
    farmId: number,
    findAllPigGroupDto: FindAllPigGroupDto,
  ) {
    return this.groupRepository.findAllAndCountPigGroup(
      farmId,
      findAllPigGroupDto,
    );
  }
  private toEventModel(data: any): EventModel {
    const model: EventModel = new EventModel({
      eventId: data.id,
      createdBy: data.createdBy || '',
      eventDate: data.eventDate || '',
      eventDefine: data.eventDefine?.name || '',
      ticketId: data.eventTicket?.ticketId || 0,
      diseaseName: data.eventTicket?.disease?.name || '',
      house: data.eventTicket.house?.name || '',
      room: data.eventTicket.room?.name || '',
      block: data.eventTicket.block?.name || '',
      medicineExpiry: data.eventTicket?.medicineExpiry || '',
      medicineLot: data.eventTicket?.medicineLot || '',
      exportId: data.eventTicket?.exportId || '',
    });
    return model;
  }
}
