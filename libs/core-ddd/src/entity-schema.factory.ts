import { AggregateRoot } from '@nestjs/cqrs';
import { EntityMongooseSchema } from './mongoose/entity.schema';
import { EntityTypeOrmSchema } from './typeorm/entity.schema';

export interface EntitySchemaFactory<
  TSchema extends EntityMongooseSchema | EntityTypeOrmSchema,
  TEntity extends AggregateRoot,
> {
  create(entity: TEntity): TSchema;
  createFromSchema(entitySchema: TSchema): TEntity;
}
