import {
  RabbitMQExchangeConfig,
  RabbitMQQueueConfig,
} from '@golevelup/nestjs-rabbitmq';

export type AmqpModuleOptions = {
  url: string;
  appName?: string;
  heartbeatIntervalInSeconds?: number;
  exchanges?: RabbitMQExchangeConfig[];
  queues?: RabbitMQQueueConfig[];
};

export interface AmqpOptionsFactory {
  createAmqpOptions(): AmqpModuleOptions | Promise<AmqpModuleOptions>;
}
