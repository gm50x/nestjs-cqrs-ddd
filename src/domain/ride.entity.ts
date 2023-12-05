import { AggregateRoot } from '@nestjs/cqrs';
import { Coord } from './coord.value';

export class Ride extends AggregateRoot {
  constructor(
    readonly id: string,
    readonly passengerId: string,
    readonly from: Coord,
    readonly to: Coord,
    readonly status: string = 'REQUESTED',
  ) {
    super();
  }
}
