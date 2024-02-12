import { Plugin } from '@gedai/amqp';
import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import {
  AmqpResiliencyModuleOptions,
  ConfigurableModuleClass,
} from './amqp-resiliency.options';
import { AmqpResiliencyService } from './amqp-resiliency.service';

@Module({
  providers: [AmqpResiliencyService],
  exports: [AmqpResiliencyService],
  controllers: [],
  imports: [],
})
export class AmqpResiliencyModule extends ConfigurableModuleClass {}

export type ResiliencyPlugin = Plugin & AmqpResiliencyModuleOptions;

export const createResiliencyPlugin = (
  options?: ResiliencyPlugin,
): ResiliencyPlugin => {
  const {
    name = 'AmqpResiliency',
    maxAttempts = 10,
    maxDoublings = 10,
    timeBetweenRetrials = 10000,
    ...rest
  } = options || ({} as any);

  const resiliencyExchange: RabbitMQExchangeConfig = {
    name: 'resiliency.dlx',
    createExchangeIfNotExists: true,
    type: 'topic',
  };

  const imports = rest.imports ? [...rest.imports] : [];
  imports.push(
    AmqpResiliencyModule.forRoot({
      maxAttempts,
      maxDoublings,
      timeBetweenRetrials,
    }),
  );

  return {
    name,
    maxDoublings,
    maxAttempts,
    timeBetweenRetrials,
    ...rest,
    imports,
    exchanges: [resiliencyExchange],
  };
};
