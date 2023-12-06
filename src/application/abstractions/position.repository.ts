import { Repository } from '@gedai/core-ddd';
import { Position } from '../../domain/position.entity';

export abstract class PositionRepository implements Repository<Position> {
  abstract findOneById(id: string): Promise<Position>;
  abstract findOneAndReplaceById(id: string, entity: Position): Promise<void>;
  abstract findAll(): Promise<Position[]>;
  abstract create(entity: Position): Promise<void>;
  abstract save(entity: Position): Promise<void>;
}
