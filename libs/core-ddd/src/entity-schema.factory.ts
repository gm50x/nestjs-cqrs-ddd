import { AggregateRoot } from '@nestjs/cqrs';
import { EntitySchema } from './entity.schema';

export interface EntitySchemaFactory<
  TSchema extends EntitySchema,
  TEntity extends AggregateRoot,
> {
  create(entity: TEntity): TSchema;
  createFromSchema(entitySchema: TSchema): TEntity;
}
