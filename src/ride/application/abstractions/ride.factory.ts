import { EntityFactory } from '@gedai/core';
import { Ride } from '../../domain/ride.entity';

export type Coord = {
  lat: number;
  long: number;
};

export abstract class RideFactory implements EntityFactory<Ride> {
  abstract create(passengerId: string, from: Coord, to: Coord): Promise<Ride>;
}
