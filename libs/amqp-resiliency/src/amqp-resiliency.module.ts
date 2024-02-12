import { Plugin } from '@gedai/amqp';
import {
  RabbitMQExchangeConfig,
  RabbitMQQueueConfig,
} from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { AmqpResiliencyController } from './amqp-resiliency.controller';
import {
  AmqpResiliencyModuleOptions,
  ConfigurableModuleClass,
} from './amqp-resiliency.options';
import { AmqpResiliencyService } from './amqp-resiliency.service';

@Module({
  providers: [AmqpResiliencyService],
  exports: [AmqpResiliencyService],
})
export class AmqpResiliencyModule extends ConfigurableModuleClass {}

export type ResiliencyPlugin = Plugin & AmqpResiliencyModuleOptions;

export const createResiliencyPlugin = (
  options?: ResiliencyPlugin,
): ResiliencyPlugin => {
  const {
    name = 'AmqpResiliency',
    maxAttempts = 10,
    maxTimeBetweenRetrials,
    timeBetweenRetrials = 10000,
    servicePrefix,
    ...rest
  } = options || ({} as unknown as ResiliencyPlugin);

  const errorExchange: RabbitMQExchangeConfig = {
    name: servicePrefix ? `${servicePrefix}.resiliency.dlx` : 'resiliency.dlx',
    createExchangeIfNotExists: true,
    type: 'topic',
  };
  const delayedExchange: RabbitMQExchangeConfig = {
    name: servicePrefix
      ? `${servicePrefix}.resiliency.delayed`
      : 'resiliency.delayed',
    createExchangeIfNotExists: true,
    type: 'x-delayed-message',
    options: {
      arguments: { 'x-delayed-type': 'topic' },
    },
  };

  const dlq: RabbitMQQueueConfig = {
    name: servicePrefix
      ? `${servicePrefix}.resiliency.dead`
      : 'resiliency.dead',
    createQueueIfNotExists: true,
  };

  const imports = rest.imports ? [...rest.imports] : [];
  imports.push(
    AmqpResiliencyModule.forRoot({
      maxAttempts,
      maxTimeBetweenRetrials,
      timeBetweenRetrials,
      servicePrefix,
    }),
  );
  const controllers = rest.controllers ? [...rest.controllers] : [];
  const BindingController = AmqpResiliencyController(servicePrefix);
  controllers.push(BindingController);

  return {
    name,
    maxTimeBetweenRetrials,
    maxAttempts,
    timeBetweenRetrials,
    ...rest,
    imports,
    controllers,
    exchanges: [errorExchange, delayedExchange],
    queues: [dlq],
  };
};
