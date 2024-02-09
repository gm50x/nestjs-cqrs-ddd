import { AsyncContextModuleOptions } from './async-context.options';

export interface AsyncContextOptionsFactory {
  setupWith(): AsyncContextModuleOptions | Promise<AsyncContextModuleOptions>;
}
