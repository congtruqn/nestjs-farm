import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitConfigService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async sendToQueue(queue: string, data: any, correlationId?: string) {
    await this.amqpConnection.channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(data)),
      {
        correlationId,
      },
    );
  }

  async publish(routingKey: string, message: any, exchange = '') {
    return await this.amqpConnection.publish(exchange, routingKey, message);
  }

  async request(routingKey: string, message: any, exchange = '') {
    return await this.amqpConnection.request({
      exchange,
      routingKey,
      payload: message,
    });
  }
}
