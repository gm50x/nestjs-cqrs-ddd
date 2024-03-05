import { Entity } from './entity';

export interface Repository<TEntity extends Entity> {
  findById(id: string): Promise<TEntity>;
  findAll(): Promise<TEntity[]>;
  create(entity: TEntity): Promise<void>;
  update(entity: TEntity): Promise<void>;
}
