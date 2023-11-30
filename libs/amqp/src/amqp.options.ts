import { ConfigurableModuleBuilder } from '@nestjs/common';

export type AmqpModuleOptions = {
  url: string;
  appName?: string;
  heartbeatIntervalInSeconds?: number;
  enableEventPropagation?: boolean;
  // TODO: add asserts here
};

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AmqpModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
