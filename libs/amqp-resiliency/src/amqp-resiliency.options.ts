import { ConfigurableModuleBuilder } from '@nestjs/common';

export type AmqpResiliencyModuleOptions = {
  maxAttempts?: number;
  timeBetweenRetrials?: number;
  maxTimeBetweenRetrials?: number;
  servicePrefix?: string;
};

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AmqpResiliencyModuleOptions>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('createAmqpResiliencyOptions')
    .build();
