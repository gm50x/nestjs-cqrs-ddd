import { ConfigurableModuleBuilder, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export type AsyncContextMiddlewareSetup = (
  store: Map<string, any>,
  req: Request,
) => void;

export type AsyncContextInterceptorSetup = (
  store: Map<string, any>,
  executionContext: ExecutionContext,
) => void;

export type AsyncContextModuleOptions = {
  middlewareSetup?: AsyncContextMiddlewareSetup;
  interceptorSetup?: AsyncContextInterceptorSetup;
};

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AsyncContextModuleOptions>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('setupWith')
    .build();
