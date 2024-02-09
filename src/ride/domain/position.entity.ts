import { Entity } from '@gedai/tactical-domain';
import { Coord } from './coord.value';

export class Position extends Entity {
  constructor(
    readonly _id: string,
    readonly rideId: string,
    readonly coord: Coord,
    readonly timestamp: Date,
  ) {
    super(_id);
  }
}
