import {
  ConfigurableModuleBuilder,
  ExecutionContext,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';
import { Request } from 'express';

export type AsyncContextMiddlewareSetup = (
  store: Map<string, any>,
  req: Request,
) => void;

export type AsyncContextInterceptorSetup = (
  store: Map<string, any>,
  executionContext: ExecutionContext,
) => void;

type ModuleMetadataImports = ModuleMetadata['imports'];
type ModuleMetadataExports = ModuleMetadata['exports'];

export type Plugin = {
  name: string;
  imports?: ModuleMetadataImports;
  providers?: Provider[];
  exports?: ModuleMetadataExports;
};

export type AsyncContextModuleExtraOptions = {
  plugins: Plugin[];
};

export type AsyncContextModuleOptions = {
  middlewareSetup?: AsyncContextMiddlewareSetup;
  interceptorSetup?: AsyncContextInterceptorSetup;
};

function ensureArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function createModuleMetadata(extras: AsyncContextModuleExtraOptions) {
  const { plugins = [] } = extras;
  const initial = {
    imports: [] as ModuleMetadataImports,
    providers: [] as Provider[],
    exports: [] as ModuleMetadataExports,
  };

  return plugins.reduce(
    (accumulated, value) => ({
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
    }),
    initial,
  );
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AsyncContextModuleOptions>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('setupWith')
    .setExtras(null, (definitions, extras: AsyncContextModuleExtraOptions) => {
      const { exports, imports, providers } = createModuleMetadata(extras);
      return {
        ...definitions,
        imports: [...ensureArray(definitions.imports), ...imports],
        exports: [...ensureArray(definitions.exports), ...exports],
        providers: [...ensureArray(definitions.providers), ...providers],
      };
    })
    .build();
