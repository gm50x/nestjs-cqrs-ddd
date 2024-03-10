import {
  RabbitMQExchangeConfig,
  RabbitMQQueueConfig,
} from '@golevelup/nestjs-rabbitmq';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export type AmqpModuleOptions = {
  url: string;
  appName?: string;
  heartbeatIntervalInSeconds?: number;
  exchanges?: RabbitMQExchangeConfig[];
  queues?: RabbitMQQueueConfig[];
  // TODO: add resiliency config here
};

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AmqpModuleOptions>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('createAmqpOptions')
    .build();
