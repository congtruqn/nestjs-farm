import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import {
  FindAllTreatmentIndividualDto,
  FindAllTreatmentIndividualModel,
} from '../model/event-ticket.model';

@Injectable()
export class EventTicketProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: any) => {
      createMap(
        mapper,
        FindAllTreatmentIndividualModel,
        FindAllTreatmentIndividualDto,
        forMember(
          (d) => d.eventStatusName,
          mapFrom((source) => source.eventStatus.name),
        ),
        forMember(
          (d) => d.diseaseName,
          mapFrom((source) => source.disease.name),
        ),
      );
    };
  }
}
