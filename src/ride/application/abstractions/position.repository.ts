import { Repository, RepositoryWriteOptions } from '@gedai/core';
import { Position } from '../../domain/position.entity';

export abstract class PositionRepository implements Repository<Position> {
  abstract findById(id: string): Promise<Position>;
  abstract findByRideId(rideId: string): Promise<Position[]>;
  abstract findAll(): Promise<Position[]>;
  abstract create(
    entity: Position,
    options?: RepositoryWriteOptions,
  ): Promise<void>;
  abstract update(
    entity: Position,
    options?: RepositoryWriteOptions,
  ): Promise<void>;
}
