import { ClientSession } from 'mongoose';
import { Entity } from './entity';

export type RepositoryWriteOptions = {
  session?: ClientSession;
};

export interface Repository<TEntity extends Entity> {
  findById(id: string): Promise<TEntity>;
  findAll(): Promise<TEntity[]>;
  create(entity: TEntity, options?: RepositoryWriteOptions): Promise<void>;
  update(entity: TEntity, options?: RepositoryWriteOptions): Promise<void>;
}
