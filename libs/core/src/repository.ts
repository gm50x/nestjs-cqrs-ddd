import { AggregateRoot } from '@nestjs/cqrs';

export interface Repository<TEntity extends AggregateRoot> {
  findOneById(id: string): Promise<TEntity>;
  findOneAndReplaceById(id: string, entity: TEntity): Promise<void>;
  findAll(): Promise<TEntity[]>;
  create(entity: TEntity): Promise<void>;
  save(entity: TEntity): Promise<void>;
}
