import {
  RabbitMQExchangeConfig,
  RabbitMQQueueConfig,
} from '@golevelup/nestjs-rabbitmq';
import {
  ConfigurableModuleBuilder,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';

export type AmqpModuleOptions = {
  url: string;
  appName?: string;
  heartbeatIntervalInSeconds?: number;
  exchanges?: RabbitMQExchangeConfig[];
  queues?: RabbitMQQueueConfig[];
};

type ModuleMetadataControllers = ModuleMetadata['controllers'];
type ModuleMetadataImports = ModuleMetadata['imports'];
type ModuleMetadataExports = ModuleMetadata['exports'];

export type Plugin = {
  name: string;
  providers?: Provider[];
  controllers?: ModuleMetadataControllers;
  imports?: ModuleMetadataImports;
  exports?: ModuleMetadataExports;
  exchanges?: AmqpModuleOptions['exchanges'];
  queues?: AmqpModuleOptions['queues'];
};

export type AmqpModuleExtraOptions = {
  plugins: Plugin[];
};

function ensureArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function createModuleMetadata(extras: AmqpModuleExtraOptions) {
  const { plugins = [] } = extras;
  const initial = {
    imports: [] as ModuleMetadataImports,
    providers: [] as Provider[],
    exports: [] as ModuleMetadataExports,
    controllers: [] as ModuleMetadataControllers,
    exchanges: [] as string[],
    queues: [] as string[],
  };

  return plugins.reduce(
    (accumulated, value) => ({
      exchanges: [
        ...ensureArray(accumulated.exchanges),
        ...ensureArray(value.exchanges),
      ],
      queues: [
        ...ensureArray(accumulated.queues),
        ...ensureArray(value.queues),
      ],
      imports: [
        ...ensureArray(accumulated.imports),
        ...ensureArray(value.imports),
      ],
      providers: [
        ...ensureArray(accumulated.providers),
        ...ensureArray(value.providers),
      ],
      exports: [
        ...ensureArray(accumulated.exports),
        ...ensureArray(value.exports),
      ],
      controllers: [
        ...ensureArray(accumulated.controllers),
        ...ensureArray(value.controllers),
      ],
    }),
    initial,
  );
}

export enum InjectionTokens {
  ExtraOptions = 'AmqpModuleExtraOptions',
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AmqpModuleOptions>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('createAmqpOptions')
    .setExtras(null, (definitions, extras: AmqpModuleExtraOptions) => {
      const { exports, imports, providers, controllers, exchanges, queues } =
        createModuleMetadata(extras);
      //TODO: refactor this
      /**
       * We are propagating the plugins exchanges here, so that @golevelup can create the queues
       * and exchanges for us automatically, without us being forced to call 'assertQueue' and 'assertExchange' manually
       */

      return {
        ...definitions,
        providers: [
          ...ensureArray(definitions.providers),
          ...providers,
          {
            provide: InjectionTokens.ExtraOptions,
            useValue: { exchanges, queues },
          },
        ],
        controllers: [...ensureArray(definitions.controllers), ...controllers],
        imports: [...ensureArray(definitions.imports), ...imports],
        exports: [
          ...ensureArray(definitions.exports),
          ...exports,
          InjectionTokens.ExtraOptions,
        ],
      };
    })
    .build();
