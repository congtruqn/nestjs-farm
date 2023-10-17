import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';
import { RabbitConfigService } from './rabbitmq.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (config: EnvironmentConfigService) => ({
        exchanges: [],
        uri: `amqp://${config.getRabbitMQUser()}:${config.getRabbitMQPassword()}@${config.getRabbitMQHost()}`,
        enableControllerDiscovery: true,
        connectionInitOptions: { wait: true, timeout: 30000, reject: true },
        connectionManagerOptions: {
          connectionOptions: {
            clientProperties: {
              connection_name: 'pig-farm-service',
            },
          },
        },
      }),
    }),
  ],
  providers: [RabbitConfigService],
  exports: [RabbitConfigService],
})
export class RabbitConfigModule {}
