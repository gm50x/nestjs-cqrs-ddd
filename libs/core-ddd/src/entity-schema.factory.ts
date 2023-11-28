import { AggregateRoot } from '@nestjs/cqrs';
import { EntityMongoSchema } from './mongo/entity.schema';
import { EntityTypeOrmSchema } from './typeorm/entity.schema';

export interface EntitySchemaFactory<
  TSchema extends EntityMongoSchema | EntityTypeOrmSchema,
  TEntity extends AggregateRoot,
> {
  create(entity: TEntity): TSchema;
  createFromSchema(entitySchema: TSchema): TEntity;
}
