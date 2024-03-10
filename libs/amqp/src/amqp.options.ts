import { ConfigurableModuleBuilder } from '@nestjs/common';
import { AmqpModuleOptions } from './amqp.factory';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AmqpModuleOptions>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('createAmqpOptions')
    .build();
