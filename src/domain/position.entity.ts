import { AggregateRoot } from '@nestjs/cqrs';
import { Coord } from './coord.value';

export class Position extends AggregateRoot {
  constructor(
    readonly id: string,
    readonly rideId: string,
    readonly coord: Coord,
    readonly timestamp: Date,
  ) {
    super();
  }
}
