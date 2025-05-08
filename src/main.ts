import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './common/config/app.config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  const corsOrigin: string = appConfig.cors_domains;
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

  await app.listen(appConfig.port).then(() => {
    console.log(`API: http://${appConfig.host}:${appConfig.port}`);
    console.log(`DOCS: http://${appConfig.host}:${appConfig.port}/docs`);
    console.log(`CORS ORIGIN: [${corsOrigin}]`);
  });
  return true;
}
bootstrap();
