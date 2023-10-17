import { Controller, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AspectLogger } from 'src/utils/interceptors/logging.interceptor';
import { TransformationInterceptor } from 'src/utils/interceptors/transform.interceptor';

@Controller('event')
@UseInterceptors(TransformationInterceptor)
@UseInterceptors(AspectLogger)
@ApiBearerAuth('Authorization')
@ApiTags('Event')
export class DiseaseController {}
