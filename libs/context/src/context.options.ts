import { ConfigurableModuleBuilder, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export type ContextMiddlewareSetup = (
  store: Map<string, any>,
  req: Request,
) => void;

export type ContextInterceptorSetup = (
  store: Map<string, any>,
  executionContext: ExecutionContext,
) => void;

export type ContextModuleOptions = {
  middlewareSetup: ContextMiddlewareSetup;
  interceptorSetup: ContextInterceptorSetup;
};

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ContextModuleOptions>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('setupWith')
    .build();
