import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { PigGroupEntity } from '../entities/pig-group.entity';
import { PigGroupRepository } from './pig-group.repository';
import { DiseaseRepository } from './disease.repository';
import { DiseaseEntity } from '../entities/disease.entity';
import { EventTicketRepository } from './event-ticket.repository';
import { EventTicketEntity } from '../entities/event-ticket.entity';
import { EventEntity } from '../entities/event.entity';
import { PigInfoRepository } from './pig-info.repository';
import { PigInfoEntity } from '../entities/pig-info.entity';
import { EventRepository } from './event.repository';
import { GeneticEntity } from '../entities/genetic.entity';
import { ChooseGiltReposotory } from './choose-gilt.repository';
import { PregnancyTestReposotory } from './pregnancy-test.repository';
import { PigEventEntity } from '../entities/pig-event.entity';
import { ReasonRepository } from './reason.repository';
import { ReasonEntity } from '../entities/reason.entity';
import { PigEventRepository } from './pig-event.repository';
import { MedicineRepository } from './medicine.repository';
import { MedicineEntity } from '../entities/medicine.entity';
import { TreatmentRepository } from './treatment.repository';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      PigGroupEntity,
      DiseaseEntity,
      EventTicketEntity,
      EventEntity,
      PigInfoEntity,
      GeneticEntity,
      PigEventEntity,
      ReasonEntity,
      MedicineEntity,
    ]),
  ],
  providers: [
    {
      provide: 'IPigGroupRepository',
      useClass: PigGroupRepository,
    },
    {
      provide: 'IDiseaseRepository',
      useClass: DiseaseRepository,
    },
    {
      provide: 'IEventTicketRepository',
      useClass: EventTicketRepository,
    },
    {
      provide: 'IPigInfoRepository',
      useClass: PigInfoRepository,
    },
    {
      provide: 'IEventRepository',
      useClass: EventRepository,
    },
    {
      provide: 'IChooseGiltReposotory',
      useClass: ChooseGiltReposotory,
    },
    {
      provide: 'IPregnancyTestReposotory',
      useClass: PregnancyTestReposotory,
    },
    {
      provide: 'IReasonRepository',
      useClass: ReasonRepository,
    },
    {
      provide: 'IPigEventRepository',
      useClass: PigEventRepository,
    },
    {
      provide: 'IMedicineRepository',
      useClass: MedicineRepository,
    },
    {
      provide: 'ITreatmentRepository',
      useClass: TreatmentRepository,
    },
  ],
  exports: [
    'IPigGroupRepository',
    'IDiseaseRepository',
    'IEventTicketRepository',
    'IPigInfoRepository',
    'IEventRepository',
    'IChooseGiltReposotory',
    'IPregnancyTestReposotory',
    'IReasonRepository',
    'IPigEventRepository',
    'IMedicineRepository',
    'ITreatmentRepository',
  ],
})
export class RepositoriesModule {}
