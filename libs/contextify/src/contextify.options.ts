import {
  ConfigurableModuleBuilder,
  ExecutionContext,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';
import { Request } from 'express';

export type ContextifyMiddlewareSetup = (
  store: Map<string, any>,
  req: Request,
) => void;

export type ContextifyInterceptorSetup = (
  store: Map<string, any>,
  executionContext: ExecutionContext,
) => void;

type ModuleMetadataControllers = ModuleMetadata['controllers'];
type ModuleMetadataImports = ModuleMetadata['imports'];
type ModuleMetadataExports = ModuleMetadata['exports'];

export type Plugin = {
  name: string;
  providers?: Provider[];
  controllers?: ModuleMetadataControllers;
  imports?: ModuleMetadataImports;
  exports?: ModuleMetadataExports;
};

export type ContextifyModuleExtraOptions = {
  plugins: Plugin[];
};

export type ContextifyModuleOptions = {
  middlewareSetup?: ContextifyMiddlewareSetup;
  interceptorSetup?: ContextifyInterceptorSetup;
};

function ensureArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function createModuleMetadata(extras: ContextifyModuleExtraOptions) {
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
  new ConfigurableModuleBuilder<ContextifyModuleOptions>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('setupWith')
    .setExtras(null, (definitions, extras: ContextifyModuleExtraOptions) => {
      const { exports, imports, providers } = createModuleMetadata(extras);
      return {
        ...definitions,
        imports: [...ensureArray(definitions.imports), ...imports],
        exports: [...ensureArray(definitions.exports), ...exports],
        providers: [...ensureArray(definitions.providers), ...providers],
      };
    })
    .build();
