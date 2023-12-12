import { AmqpModuleOptions } from './amqp.options';

export interface AmqpOptionsFactory {
  createAmqpOptions(): AmqpModuleOptions | Promise<AmqpModuleOptions>;
}
