import { AutoMap } from '@automapper/classes';
import { DiseaseEntity } from 'src/infrastructure/entities/disease.entity';
import { EventStatusEntity } from 'src/infrastructure/entities/event-status.entity';
import { EventTicketEntity } from 'src/infrastructure/entities/event-ticket.entity';

export class FindAllTreatmentIndividualModel extends EventTicketEntity {
  @AutoMap()
  ticketId: string;

  @AutoMap(() => EventStatusEntity)
  eventStatus: EventStatusEntity;

  @AutoMap(() => DiseaseEntity)
  disease: DiseaseEntity;
}

export class FindAllTreatmentIndividualDto extends EventTicketEntity {
  @AutoMap()
  id: number;

  @AutoMap()
  eventStatusName: string | null;

  @AutoMap()
  diseaseName: string | null;
}
