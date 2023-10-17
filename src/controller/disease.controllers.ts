import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DiseaseUseCases } from 'src/usecases/disease.usecases';
import { AspectLogger } from 'src/utils/interceptors/logging.interceptor';
import { TransformationInterceptor } from 'src/utils/interceptors/transform.interceptor';

@Controller('disease')
@UseInterceptors(TransformationInterceptor)
@UseInterceptors(AspectLogger)
@ApiBearerAuth('Authorization')
@ApiTags('Treatment')
export class DiseaseController {
  constructor(private readonly diseaseUseCases: DiseaseUseCases) {}

  @Get('')
  async getAll() {
    const result = await this.diseaseUseCases.findAllDisease();
    return {
      items: result,
    };
  }
}
