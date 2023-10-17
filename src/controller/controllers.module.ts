import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { EnvironmentConfigModule } from 'src/infrastructure/config/environment-config/environment-config.module';
import { RepositoriesModule } from 'src/infrastructure/repositories/repositories.module';
import { DiseaseUseCases } from 'src/usecases/disease.usecases';
import { TreatmentIndividualUseCases } from 'src/usecases/treatment-individual';
import { PigGroupUseCases } from 'src/usecases/pig-group.usecases';
import { TreatmentUseCases } from 'src/usecases/treatment.usecases';
import { DiseaseController } from './disease.controllers';
import { HealthController } from './health.controller';
import { PigGroupController } from './pig-group.controllers';
import { TreatmentController } from './treatment.controllers';
import { ChooseGiltController } from './choose-gilts.controllers';
import { ChooseGiltUseCases } from 'src/usecases/choose-gilt.usecases';
import { PregnancyTestController } from './pregnancy-test.controllers';
import { PregnancyTestUseCases } from 'src/usecases/pregnancy-test.usecases';
import { ReasonUseCases } from 'src/usecases/reason.usecases';

@Module({
  imports: [RepositoriesModule, EnvironmentConfigModule, TerminusModule],
  controllers: [
    PigGroupController,
    HealthController,
    TreatmentController,
    DiseaseController,
    ChooseGiltController,
    PregnancyTestController,
  ],
  providers: [
    PigGroupUseCases,
    DiseaseUseCases,
    TreatmentUseCases,
    TreatmentIndividualUseCases,
    ChooseGiltUseCases,
    PregnancyTestUseCases,
    ReasonUseCases,
  ],
})
export class ControllersModule {}
