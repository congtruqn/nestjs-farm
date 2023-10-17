import {
  FindAllPregnancyTestEventByPigInfoDto,
  FindAllPregnancyTestEventDto,
} from 'src/dtos/pregnancy-test/find-all-pregnancy-test-events.dto';
import { PigEventEntity } from 'src/infrastructure/entities/pig-event.entity';
export interface IPregnancyTestReposotory {
  findAllPregneancyEvents(
    findAllChooseGiltPigByTicketDto: FindAllPregnancyTestEventDto,
  ): Promise<[any[], totalCount: number]>;
  findAllPregnancyPigs(farmId: number): Promise<any[]>;
  getPregneancyEventById(farmId: number, eventId: number): Promise<any>;
  getAllPregnancyTestEventByPigInfo(
    query: FindAllPregnancyTestEventByPigInfoDto,
  ): Promise<any>;
  updatePregneancyTestEvent(
    id: number,
    farmId: number,
    data: PigEventEntity,
  ): Promise<any>;
  deletePregneancyEventById(farmId: number, eventId: number): Promise<any>;
}
