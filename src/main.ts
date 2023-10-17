import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { RabbitConfigService } from './infrastructure/config/rabbitmq/rabbitmq.service';
//import { HttpErrorFilter } from './utils/interceptors/http-error.filter';
import { HttpErrorFilter } from './utils/exception/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('pig-farm-service');
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Pig Farm API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('Treatment', '')
    .addTag('Choose Gilt', '')
    .setBasePath('pig-farm-service')
    .addBearerAuth(
      {
        description: ``,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      operationsSorter: 'method',
    },
  });
  //const rabbitConfigService = app.get(RabbitConfigService);
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(8000);
}
bootstrap();
