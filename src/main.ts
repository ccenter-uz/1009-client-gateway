import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './common/config/app.config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  const corsOrigin: string = appConfig.cors_domains;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'client', // Match the queue name from organization service
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'amq.topic',
          'x-dead-letter-routing-key': 'client.dlq',
        },
      },
      noAck: false, // we'll ack manually after processing
      prefetchCount: 10, // back-pressure
      persistent: true, // persistent messages
    },
  });

  app.setGlobalPrefix('v1');
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  /* CORS */
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
    })
  );
  /* SWAGGER */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Client Api Docs')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const platformDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, platformDocument);
  await app.startAllMicroservices();

  await app.listen(appConfig.port).then(() => {
    console.log(`API: http://${appConfig.host}:${appConfig.port}`);
    console.log(`DOCS: http://${appConfig.host}:${appConfig.port}/docs`);
    console.log(`CORS ORIGIN: [${corsOrigin}]`);
  });
  return true;
}
bootstrap();
