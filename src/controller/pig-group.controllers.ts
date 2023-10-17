import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllEventByPigGroupDto } from 'src/dtos/pig-group/find-all-events.dto';
import { FindAllPigGroupDto } from 'src/dtos/pig-group/find-all-pig-group.dto';
import { PigGroupUseCases } from 'src/usecases/pig-group.usecases';
import { AspectLogger } from 'src/utils/interceptors/logging.interceptor';
import { TransformationInterceptor } from 'src/utils/interceptors/transform.interceptor';
@Controller('/:farmId/pig-group')
@UseInterceptors(TransformationInterceptor)
@UseInterceptors(AspectLogger)
@ApiBearerAuth('Authorization')
@ApiTags('Pig Group')
export class PigGroupController {
  constructor(private readonly pigGroupUseCases: PigGroupUseCases) {}

  @Get('')
  async findAllPigGroupByOptions(
    @Query() findAllPigGroupDto: FindAllPigGroupDto,
    @Param('farmId', ParseIntPipe) farmId: number,
  ) {
    const { pageSize = 20 } = findAllPigGroupDto;
    const [result, totalCount] =
      await this.pigGroupUseCases.findAllAndCountPigGroup(
        farmId,
        findAllPigGroupDto,
      );

    const totalPage = Math.ceil(totalCount / pageSize);
    const response = {
      items: result,
      totalCount,
      totalPage,
    };
    return response;
  }

  @Get('/:id')
  async findOne(
    @Param('id') id: number,
    //@Param('farmId', ParseIntPipe) farmId: number,
  ) {
    const result = await this.pigGroupUseCases.findOnePigGroup(id);
    return result;
  }
  @Get('/:id/events')
  async findAllEvent(
    @Param('id') id: number,
    @Param('farmId', ParseIntPipe) farmId: number,
    @Query() findAllEventByPigGroupDto: FindAllEventByPigGroupDto,
  ) {
    const result = await this.pigGroupUseCases.findAllEvent(
      farmId,
      id,
      findAllEventByPigGroupDto,
    );
    return result;
  }
}
