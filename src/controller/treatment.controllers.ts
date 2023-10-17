import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateIndividualTreatmentDto,
  UpdateIndividualTreatmentDto,
} from 'src/dtos/treatment/create-individual-treatment.dto';
import {
  CreateSerialTreatmentDto,
  UpdateTreatmentDto,
} from 'src/dtos/treatment/create-serial-treatment.dto';
import {
  FindAllTreatmentEventsDto,
  FindTreatmentEventByPigDto,
} from 'src/dtos/treatment/find-all-events.dto';
import { FindAllSerialTreatmentDto } from 'src/dtos/treatment/find-all-serial-treatment.dto';
import { QueryFindAllTreatmentIndividualDto } from 'src/dtos/treatment/find-all-treatment-individual.dto';
import { ImportTreatmentDto } from 'src/dtos/treatment/import-treatment.dto';
import { PigGroupUseCases } from 'src/usecases/pig-group.usecases';
import { TreatmentIndividualUseCases } from 'src/usecases/treatment-individual';
import { TreatmentUseCases } from 'src/usecases/treatment.usecases';
import { AspectLogger } from 'src/utils/interceptors/logging.interceptor';
import { TransformationInterceptor } from 'src/utils/interceptors/transform.interceptor';
import { AuthUser } from 'src/utils/interceptors/user.decorator';

@Controller('/:farmId/treatment')
@UseInterceptors(TransformationInterceptor)
@UseInterceptors(AspectLogger)
@ApiBearerAuth('Authorization')
@ApiTags('Treatment')
export class TreatmentController {
  constructor(
    private readonly pigGroupUseCases: PigGroupUseCases,
    private readonly treatmentUseCases: TreatmentUseCases,
    private readonly treatmentIndividualUseCases: TreatmentIndividualUseCases,
  ) {}

  @Post('/serials')
  async findAllPigGroupByOptions(
    @Body() createSerialTreatmentDto: CreateSerialTreatmentDto,
    @Param('farmId') farmId: number,
    @AuthUser() jwtpayload: any,
  ) {
    createSerialTreatmentDto.farmId = farmId;
    createSerialTreatmentDto.createdBy = jwtpayload.userInfo?.username;
    return this.treatmentUseCases.createSerialTreatment(
      createSerialTreatmentDto,
    );
  }

  @Post('/individual/import')
  async importTreatment(
    @Body() data: ImportTreatmentDto,
    @Param('farmId') farmId: number,
    @AuthUser() jwtpayload: any,
  ) {
    data.farmId = farmId;
    data.createdBy = jwtpayload.userInfo?.id || '';
    return this.treatmentUseCases.importTreatment(data);
  }

  @Post('/serial/import')
  async importSerialTreatment(
    @Body() createSerialTreatmentDto: CreateSerialTreatmentDto,
    @Param('farmId') farmId: number,
    @AuthUser() jwtpayload: any,
  ) {
    createSerialTreatmentDto.farmId = farmId;
    createSerialTreatmentDto.createdBy = jwtpayload.userInfo?.username;
    return this.treatmentUseCases.createSerialTreatment(
      createSerialTreatmentDto,
    );
  }

  @Post('/individual')
  async saveIndividual(
    @Param('farmId') farmId: number,
    @Body() data: CreateIndividualTreatmentDto,
    @AuthUser() jwtpayload: any,
  ) {
    return this.treatmentIndividualUseCases.createTreatmentIndividual({
      ...data,
      farmId,
      createdBy: jwtpayload.userInfo?.username || '',
    });
  }

  @Post('/')
  async createTreatment(
    @Param('farmId') farmId: number,
    @Body() data: CreateIndividualTreatmentDto,
    @AuthUser() jwtpayload: any,
  ) {
    return this.treatmentUseCases.createTreatment({
      ...data,
      farmId,
      createdBy: data.createdBy
        ? data.createdBy
        : jwtpayload.userInfo?.id || '',
    });
  }

  @Put('/individual/:id')
  async updateIndividual(
    @Param('id', ParseIntPipe) id: number,
    @Param('farmId', ParseIntPipe) farmId: number,
    @Body() data: UpdateIndividualTreatmentDto,
    @AuthUser() jwtpayload: any,
  ) {
    return this.treatmentIndividualUseCases.updateTreatmentIndividual(id, {
      ...data,
      farmId,
      updatedBy: jwtpayload.userInfo?.username || '',
    });
  }

  @Post('/individual/:id/approve')
  async approveIndividual(
    @Param('id', ParseIntPipe) id: number,
    @Param('farmId', ParseIntPipe) farmId: number,
    @AuthUser() jwtpayload: any,
  ) {
    return this.treatmentUseCases.approveTreatment(
      id,
      farmId,
      jwtpayload.userInfo?.id || '',
    );
  }

  @Get('/individual')
  async findAllTreatmentIndividual(
    @Param('farmId') farmId: number,
    @Query() query: QueryFindAllTreatmentIndividualDto,
  ) {
    return this.treatmentIndividualUseCases.findAllTreatmentIndividual(
      farmId,
      query,
    );
  }

  @Get('/')
  async findAllTreatmenEvent(
    @Param('farmId') farmId: number,
    @Query() query: FindAllTreatmentEventsDto,
  ) {
    query.farmId = farmId;
    return await this.treatmentUseCases.findAllTreatmentEvent(query);
  }

  @Get('/:eventId')
  async getTreatmenEvent(
    @Param('farmId') farmId: number,
    @Param('eventId') eventId: number,
  ) {
    return await this.treatmentUseCases.getOneTreatmentEvent(farmId, eventId);
  }

  @Put('/:eventId')
  async updateTreatmentEvent(
    @Param('farmId') farmId: number,
    @Param('eventId') eventId: number,
    @Body() updateSerialTreatmentDto: UpdateTreatmentDto,
    @AuthUser() jwtpayload: any,
  ) {
    updateSerialTreatmentDto.updatedBy = jwtpayload.userInfo?.id || '';
    return this.treatmentUseCases.updateTreatment(
      eventId,
      farmId,
      updateSerialTreatmentDto,
    );
  }

  @Get('/individual/:id')
  async findOneTreatmentIndividual(
    @Param('farmId') farmId: number,
    @Param('id') id: number,
  ) {
    return this.treatmentIndividualUseCases.findOneEventTicketByOptions(
      farmId,
      id,
    );
  }

  @Get('/serials')
  async getAllSerials(
    @Param('farmId') farmId: number,
    @Query() findAllSerialTreatmentDto: FindAllSerialTreatmentDto,
  ) {
    return this.treatmentUseCases.findAllSerialTreatment(
      farmId,
      findAllSerialTreatmentDto,
    );
  }

  @Get('/serials/:id')
  async getOneSerialTicket(
    @Param('farmId') farmId: number,
    @Param('id') id: number,
  ) {
    return this.treatmentUseCases.getOneSerialTreatment(farmId, id);
  }

  @Get('/pig-info/:pigInfoId/events')
  async getTreatmentEventByPigInfo(
    @Param('farmId') farmId: number,
    @Param('pigInfoId') pigInfoId: number,
    @Query() findTreatmentEventByPigDto: FindTreatmentEventByPigDto,
  ) {
    findTreatmentEventByPigDto.farmId = farmId;
    return this.treatmentUseCases.getTreatmentEventByPigInfo(
      pigInfoId,
      findTreatmentEventByPigDto,
    );
  }

  // @Put('/serials/:id')
  // async updateSerialTicket(
  //   @Param('farmId') farmId: number,
  //   @Param('id') id: number,
  //   @Body() updateSerialTreatmentDto: UpdateSerialTreatmentDto,
  //   @AuthUser() jwtpayload: any,
  // ) {
  //   updateSerialTreatmentDto.updatedBy = jwtpayload.userInfo?.id || '';
  //   return this.treatmentUseCases.updateTreatment(
  //     id,
  //     farmId,
  //     updateSerialTreatmentDto,
  //   );
  // }

  @Post('/serials/:id/approve')
  async approveSerialTicket(
    @Param('farmId') farmId: number,
    @Param('id') id: number,
  ) {
    return this.treatmentUseCases.approveSerialTreatment(id, farmId);
  }
}
