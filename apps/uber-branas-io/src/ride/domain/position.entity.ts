import { Entity } from '@gedai/nestjs-tactical-design';
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
