import { EntityFactory } from '@gedai/tactical-domain';
import { Position } from '../../domain/position.entity';
import { Coord } from './ride.factory';

export abstract class PositionFactory implements EntityFactory<Position> {
  abstract create(rideId: string, coord: Coord): Promise<Position>;
}
