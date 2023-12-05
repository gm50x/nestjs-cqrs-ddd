import { AggregateRoot } from '@nestjs/cqrs';
import { Coord } from './coord.value';

export class Ride extends AggregateRoot {
  driverId?: string;
  status: string;

  constructor(
    readonly id: string,
    readonly passengerId: string,
    driverId: string | null,
    readonly from: Coord,
    readonly to: Coord,
    status: string | null,
    readonly date: Date,
  ) {
    super();
    this.status = status ?? 'REQUESTED';
    this.driverId = driverId;
  }

  accept(driverId: string) {
    this.driverId = driverId;
    this.status = 'ACCEPTED';
  }
}
