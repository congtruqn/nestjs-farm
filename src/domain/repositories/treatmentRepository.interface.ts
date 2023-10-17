import {
  FindAllTreatmentEventsDto,
  FindTreatmentEventByPigDto,
} from 'src/dtos/treatment/find-all-events.dto';
export interface ITreatmentRepository {
  findAllTreatmentEvents(
    query: FindAllTreatmentEventsDto,
  ): Promise<[any[], totalCount: number]>;
  getOneTreatmentEvent(farmId: number, eventId: number): Promise<any>;
  findAllTreatmentEventsByPig(
    pigInfoId: number,
    query: FindTreatmentEventByPigDto,
  ): Promise<[any[], totalCount: number]>;
}
