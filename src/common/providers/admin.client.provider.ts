import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ServicesRmqConfig } from '../config/app.config';
import { CONFIG_SERVICES_RMQ_TOKEN } from 'types/config';

export const ADMIN_CLIENT = 'ADMIN_CLIENT';

export const adminClientProvider: FactoryProvider = {
  provide: ADMIN_CLIENT,
  useFactory: async (configService: ConfigService) => {
    const rmqConfig = configService.get<ServicesRmqConfig>(
      CONFIG_SERVICES_RMQ_TOKEN
    );

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${rmqConfig.CONFIG.login}:${rmqConfig.CONFIG.password}@${rmqConfig.CONFIG.host}:${rmqConfig.CONFIG.port}`,
        ],
        queue: rmqConfig.ADMIN.queueName,
        queueOptions: {
          durable: true,
        },
      },
    });
  },
  inject: [ConfigService],
};
