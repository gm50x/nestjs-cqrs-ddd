import { Entity } from './entity';
import { EntityMongooseSchema } from './mongoose/entity.schema';

export interface EntitySchemaFactory<
  TSchema extends EntityMongooseSchema,
  TEntity extends Entity,
> {
  create(entity: TEntity): TSchema;
  createFromSchema(entitySchema: TSchema): TEntity;
}
