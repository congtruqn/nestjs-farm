import { EventDefineEntity } from 'src/infrastructure/entities/event-define.entity';
import { DataSource } from 'typeorm';
import * as dayjs from 'dayjs';
import { randomId } from './common';
export const generateTicket = async (
  _dataSource: DataSource,
  eventDefineId: number,
): Promise<string> => {
  const dayString = dayjs(new Date()).format('YYYYMMDD');
  const eventDefineInfo = await _dataSource
    .getRepository(EventDefineEntity)
    .findOne({
      where: {
        id: eventDefineId,
      },
    });
  return eventDefineInfo.serialNo + dayString + randomId(3);
};
