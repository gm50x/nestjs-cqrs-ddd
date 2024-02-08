import { Entity } from './entity';

export interface EntityFactory<TEntity extends Entity> {
  create(...args: any): TEntity | Promise<TEntity>;
}
