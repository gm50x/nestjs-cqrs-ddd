import { Repository } from '@gedai/core';
import { Position } from '../../domain/position.entity';

export abstract class PositionRepository implements Repository<Position> {
  abstract findById(id: string): Promise<Position>;
  abstract findAndReplaceById(id: string, entity: Position): Promise<void>;
  abstract findByRideId(rideId: string): Promise<Position[]>;
  abstract findAll(): Promise<Position[]>;
  abstract create(entity: Position): Promise<void>;
  abstract update(entity: Position): Promise<void>;
}
