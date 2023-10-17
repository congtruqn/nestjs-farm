import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQConfig } from 'src/domain/config/rabbitmq.interface';
import { DatabaseConfig } from '../../../domain/config/database.interface';

@Injectable()
export class EnvironmentConfigService
  implements DatabaseConfig, RabbitMQConfig
{
  constructor(private configService: ConfigService) {}

  getRabbitMQHost(): string {
    return this.configService.get<string>('RABBITMQ_HOST');
  }
  getRabbitMQUser(): string {
    return this.configService.get<string>('RABBITMQ_USER');
  }
  getRabbitMQPassword(): string {
    return this.configService.get<string>('RABBITMQ_PASSWORD');
  }

  getRabbitMQQueueService(): string {
    return this.configService.get<string>('RABBITMQ_QUEUE_SERVICE');
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST');
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT');
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USER');
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD');
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME');
  }

  getDatabaseSchema(): string {
    return this.configService.get<string>('DATABASE_SCHEMA');
  }

  getDatabaseSync(): boolean {
    return this.configService.get<boolean>('DATABASE_SYNCHRONIZE');
  }
}
