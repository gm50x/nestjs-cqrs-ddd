import {
  RabbitMQChannelConfig,
  RabbitMQExchangeConfig,
  RabbitMQQueueConfig,
} from '@golevelup/nestjs-rabbitmq';

export type AmqpModuleOptions = {
  url: string;
  appName?: string;
  heartbeatIntervalInSeconds?: number;
  reconnectInSeconds?: number;
  exchanges?: RabbitMQExchangeConfig[];
  queues?: RabbitMQQueueConfig[];
  channels?: (RabbitMQChannelConfig & { name: string })[];
};

export interface AmqpOptionsFactory {
  createAmqpOptions(): AmqpModuleOptions | Promise<AmqpModuleOptions>;
}
