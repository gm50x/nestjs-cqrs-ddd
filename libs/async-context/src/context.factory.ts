import { ContextModuleOptions } from './context.options';

export interface ContextOptionsFactory {
  setupWith(): ContextModuleOptions | Promise<ContextModuleOptions>;
}
