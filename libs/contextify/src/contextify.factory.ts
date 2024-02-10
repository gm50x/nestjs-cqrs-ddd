import { ContextifyModuleOptions } from './contextify.options';

export interface ContextifyOptionsFactory {
  setupWith(): ContextifyModuleOptions | Promise<ContextifyModuleOptions>;
}
