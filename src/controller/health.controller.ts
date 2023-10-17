import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';

import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { getData } from 'src/utils/http';
import { AspectLogger } from 'src/utils/interceptors/logging.interceptor';
import { TransformationInterceptor } from 'src/utils/interceptors/transform.interceptor';

@Controller('health')
@UseInterceptors(TransformationInterceptor)
@UseInterceptors(AspectLogger)
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private orm: TypeOrmHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private configService: EnvironmentConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.orm.pingCheck('database'),
      () =>
        this.microservice.pingCheck('rabbitmq', {
          timeout: 5000,
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${this.configService.getRabbitMQUser()}:${this.configService.getRabbitMQPassword()}@${this.configService.getRabbitMQHost()}/`,
            ],
          },
        }),
    ]);
  }

  @Get('test')
  async checkAuthService() {
    return getData('http://auth_service:8000/auth/verify', {});
  }
}
