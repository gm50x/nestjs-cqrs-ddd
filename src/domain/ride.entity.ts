import { RideAcceptedEvent } from '@gedai/core-events/ride/ride-accepted.event';
import { RideCompletedEvent } from '@gedai/core-events/ride/ride-completed.event';
import { RideStartedEvent } from '@gedai/core-events/ride/ride-started.event';
import { AggregateRoot } from '@nestjs/cqrs';
import { Coord } from './coord.value';
import { DistanceCalculator } from './distance-calculator.ds';
import { FareCalculatorFactory } from './fare-calculator.ds';
import { Position } from './position.entity';

export class Ride extends AggregateRoot {
  driverId?: string;
  status: string;
  distance?: number;
  fare?: number;

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
    this.apply(new RideAcceptedEvent(this.id));
  }

  start() {
    this.status = 'IN_PROGRESS';
    this.apply(new RideStartedEvent(this.id));
  }

  finish(positions: Position[]) {
    this.distance = 0;
    for (const [index, currentPosition] of positions.entries()) {
      const nextPosition = positions[index + 1];
      if (!nextPosition) {
        break;
      }
      this.distance = DistanceCalculator.calculate(
        currentPosition.coord,
        nextPosition.coord,
      );
    }
    const fareCalculator = FareCalculatorFactory.create(this.date);
    this.fare = fareCalculator.calculate(this.distance);
    this.status = 'COMPLETED';
    this.apply(new RideCompletedEvent(this.id));
  }
}
