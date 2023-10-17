import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePregnancyTestDto } from 'src/dtos/pregnancy-test/create-pregnancy-test.dto';
import {
  FindAllPregnancyTestEventByPigInfoDto,
  FindAllPregnancyTestEventDto,
  FindSowPigDto,
} from 'src/dtos/pregnancy-test/find-all-pregnancy-test-events.dto';
import { ImportPregnancyTestDto } from 'src/dtos/pregnancy-test/import-pregnancy-test.dto';
import { UpdatePregnancyTestDto } from 'src/dtos/pregnancy-test/update-pregnancy-test.dto';
import { PregnancyTestUseCases } from 'src/usecases/pregnancy-test.usecases';
import { ReasonUseCases } from 'src/usecases/reason.usecases';
import { AspectLogger } from 'src/utils/interceptors/logging.interceptor';
import { TransformationInterceptor } from 'src/utils/interceptors/transform.interceptor';
import { AuthUser } from 'src/utils/interceptors/user.decorator';

@Controller('/:farmId/pregnancy-test')
@UseInterceptors(TransformationInterceptor)
@UseInterceptors(AspectLogger)
@ApiBearerAuth('Authorization')
@ApiTags('Pregnancy test')
export class PregnancyTestController {
  constructor(
    private readonly pregnancyTestUseCases: PregnancyTestUseCases,
    private readonly reasonUseCases: ReasonUseCases,
  ) {}

  @Post('/import')
  async importPregnancyTest(
    @Param('farmId') farmId: number,
    @Body() data: ImportPregnancyTestDto,
    @AuthUser() jwtpayload: any,
  ) {
    data.createdBy = data.createdBy
      ? data.createdBy
      : jwtpayload.userInfo?.id || '';
    return await this.pregnancyTestUseCases.importPregnancyTest(farmId, data);
  }

  @Get('')
  async findAllPregnencyEvents(
    @Param('farmId') farmId: number,
    @Query() query: FindAllPregnancyTestEventDto,
  ) {
    return await this.pregnancyTestUseCases.findAllPregnencyEvents(
      farmId,
      query,
    );
  }

  @Post('')
  async createPregnencyEvents(
    @Param('farmId') farmId: number,
    @Body() data: CreatePregnancyTestDto,
    @AuthUser() jwtpayload: any,
  ) {
    data.farmId = farmId;
    data.createdBy = data.createdBy
      ? data.createdBy
      : jwtpayload.userInfo?.id || '';
    return await this.pregnancyTestUseCases.createPregnacyTest(data);
  }

  @Get('/event/:eventId')
  async getByEventIdID(
    @Param('farmId') farmId: number,
    @Param('eventId') eventId: number,
  ) {
    return this.pregnancyTestUseCases.getPigEventById(farmId, eventId);
  }

  @Get('/get-all-sow')
  async getAllSow(
    @Param('farmId') farmId: number,
    @Query() query: FindSowPigDto,
  ) {
    query.farmId = farmId;
    return this.pregnancyTestUseCases.getAllSow(query);
  }

  @Get('/get-pregnancy-test-reason')
  async getReason() {
    return this.reasonUseCases.getPregnancyTestReason();
  }

  @Put('/event/:eventId')
  async updateByEventIdID(
    @Param('farmId') farmId: number,
    @Param('eventId') eventId: number,
    @AuthUser() jwtpayload: any,
    @Body() body: UpdatePregnancyTestDto,
  ) {
    body.createdBy = jwtpayload.userInfo?.id || '';
    body.farmId = farmId;
    return this.pregnancyTestUseCases.updatePregnancyTestEventById(
      eventId,
      body,
    );
  }

  @Get('/pig-info/:pigInfoId/events')
  async getAllChooseGilsPigByGroup(
    @Param('farmId') farmId: number,
    @Param('pigInfoId') pigInfoId: number,
    @Query()
    query: FindAllPregnancyTestEventByPigInfoDto,
  ) {
    query.farmId = farmId;
    query.pigInfoId = pigInfoId;
    return await this.pregnancyTestUseCases.getAllEventByPigInfo(query);
  }

  @Delete('/event/:eventId')
  async deleteByEventIdID(
    @Param('farmId') farmId: number,
    @Param('eventId') eventId: number,
  ) {
    return this.pregnancyTestUseCases.deleteEventById(farmId, eventId);
  }
}
