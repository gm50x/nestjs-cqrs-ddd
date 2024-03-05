import { Entity } from './entity';

export interface EntitySchemaFactory<TSchema, TEntity extends Entity> {
  create(entity: TEntity): TSchema;
  createFromSchema(entitySchema: TSchema): TEntity;
}
