import { AggregateRoot } from '@nestjs/cqrs';
import { EntityMongooseSchema } from './mongoose/entity.schema';

export interface EntitySchemaFactory<
  TSchema extends EntityMongooseSchema,
  TEntity extends AggregateRoot,
> {
  create(entity: TEntity): TSchema;
  createFromSchema(entitySchema: TSchema): TEntity;
}
