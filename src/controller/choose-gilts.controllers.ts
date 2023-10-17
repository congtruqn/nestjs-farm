import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExportChooseGiltsDto } from 'src/dtos/choose-gilt/export-choose-gilts.dto';
import {
  FindAllChooseGiltPigByTicketDto,
  FindAllChooseGiltPigsDto,
  FindAllChooseGiltTicketDto,
} from 'src/dtos/choose-gilt/find-all-choose-gilts.dto';
import { UpdateChooseGiltEventDto } from 'src/dtos/choose-gilt/update-choose-gilt-event';
import { ChooseGiltsDto } from 'src/dtos/choose-gilt/validate-choose-gilts.dto';
import { ChooseGiltUseCases } from 'src/usecases/choose-gilt.usecases';
import { PigGroupUseCases } from 'src/usecases/pig-group.usecases';
import { TreatmentIndividualUseCases } from 'src/usecases/treatment-individual';
import { TreatmentUseCases } from 'src/usecases/treatment.usecases';
import { AspectLogger } from 'src/utils/interceptors/logging.interceptor';
import { TransformationInterceptor } from 'src/utils/interceptors/transform.interceptor';
import { AuthUser } from 'src/utils/interceptors/user.decorator';

@Controller('/:farmId/choose-gilt')
@UseInterceptors(TransformationInterceptor)
@UseInterceptors(AspectLogger)
@ApiBearerAuth('Authorization')
@ApiTags('Choose Gilt')
export class ChooseGiltController {
  constructor(
    private readonly pigGroupUseCases: PigGroupUseCases,
    private readonly treatmentUseCases: TreatmentUseCases,
    private readonly treatmentIndividualUseCases: TreatmentIndividualUseCases,
    private readonly chooseGiltUseCases: ChooseGiltUseCases,
  ) {}
  @Post('/export')
  async exportChooseGiltPig(@Param('farmId') farmId: number) {
    return this.chooseGiltUseCases.exportPigs(farmId);
  }

  @Post('/import')
  async validateChooseGiltPig(
    @Param('farmId') farmId: number,
    @Body() data: ChooseGiltsDto,
    @AuthUser() jwtpayload: any,
  ) {
    jwtpayload.userInfo?.username || '';
    data.createdBy = jwtpayload.userInfo?.id || '';
    return await this.chooseGiltUseCases.importChoosePigs(farmId, data);
  }

  @Get('/')
  async findAllChooseGiltTicket(
    @Param('farmId') farmId: number,
    @Query() query: FindAllChooseGiltTicketDto,
  ) {
    const { pageSize = 20 } = query;
    const [result, totalCount] =
      await this.chooseGiltUseCases.findAllChooseGiltTicket(farmId, query);

    const totalPage = Math.ceil(totalCount / pageSize);
    const response = {
      items: result,
      totalCount,
      totalPage,
    };
    return response;
  }

  @Get('/list-pigs')
  async getAllChooseGilsPig(
    @Param('farmId') farmId: number,
    @Query() findAllChooseGiltPigsDto: FindAllChooseGiltPigsDto,
  ) {
    findAllChooseGiltPigsDto.farmId = farmId;
    return this.chooseGiltUseCases.getAllChooseGiltPigs(
      findAllChooseGiltPigsDto,
    );
  }

  @Get('/list-pigs/ticket/:id')
  async getAllChooseGilsPigByID(
    @Param('farmId') farmId: number,
    @Param('id') id: number,
    @Query() findAllChooseGiltPigByTicketDto: FindAllChooseGiltPigByTicketDto,
  ) {
    findAllChooseGiltPigByTicketDto.farmId = farmId;
    findAllChooseGiltPigByTicketDto.ticketId = id;
    return this.chooseGiltUseCases.getAllChooseGiltPigsByTicket(
      findAllChooseGiltPigByTicketDto,
    );
  }

  @Get('/event/:eventId')
  async getByEventIdID(
    @Param('farmId') farmId: number,
    @Param('eventId') eventId: number,
  ) {
    return this.chooseGiltUseCases.getChooseGiltsEventById(eventId);
  }

  @Put('/event/:eventId')
  async updateByEventIdID(
    @Param('farmId') farmId: number,
    @Param('eventId') eventId: number,
    @Body() updateChooseGiltEventDto: UpdateChooseGiltEventDto,
  ) {
    updateChooseGiltEventDto.farmId = farmId;
    return this.chooseGiltUseCases.updateChooseGiltsEventById(
      eventId,
      updateChooseGiltEventDto,
    );
  }

  @Get('/list-pig-by-group')
  async getAllChooseGilsPigByGroup(
    @Param('farmId') farmId: number,
    @Query() exportChooseGiltsDto: ExportChooseGiltsDto,
  ) {
    exportChooseGiltsDto.farmId = farmId;
    return await this.chooseGiltUseCases.getAllChooseGiltPigByGroup(
      exportChooseGiltsDto,
    );
  }

  @Get('/:id')
  async getOneSerialTicket(
    @Param('farmId') farmId: number,
    @Param('id') id: number,
  ) {
    return this.chooseGiltUseCases.getChooseGiltTicket(farmId, id);
  }
}
