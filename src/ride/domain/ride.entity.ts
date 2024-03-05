import {
  RideAcceptedEvent,
  RideFinishedEvent,
  RideStartedEvent,
} from '@gedai/events';
import { Entity } from '@gedai/tactical-design';
import { Coord } from './coord.value';
import { DistanceCalculator } from './distance-calculator.ds';
import { FareCalculatorFactory } from './fare-calculator.ds';
import { Position } from './position.entity';
import { RideStatus } from './ride-status.value';

export class Ride extends Entity {
  private _driverId?: string;
  private _distance?: number;
  private _fare?: number;
  private _status: RideStatus;

  constructor(
    protected readonly _id: string,
    readonly passengerId: string,
    driverId: string | null,
    readonly from: Coord,
    readonly to: Coord,
    status: RideStatus,
    readonly date: Date,
    fare?: number,
    distance?: number,
  ) {
    super(_id);
    this._status = status;
    this._driverId = driverId;
    this._fare = fare;
    this._distance = distance;
  }

  get status() {
    return this._status;
  }

  get driverId(): string | null {
    return this._driverId;
  }

  get fare(): number | null {
    return this._fare;
  }

  get distance(): number | null {
    return this._distance;
  }

  accept(driverId: string) {
    this._driverId = driverId;
    this._status = this._status.accept();
    this.apply(new RideAcceptedEvent(this.id));
  }

  start() {
    this._status = this._status.start();
    this.apply(new RideStartedEvent(this.id));
  }

  finish(positions: Position[]) {
    this._distance = 0;
    for (const [index, currentPosition] of positions.entries()) {
      const nextPosition = positions[index + 1];
      if (!nextPosition) {
        break;
      }
      this._distance = DistanceCalculator.calculate(
        currentPosition.coord,
        nextPosition.coord,
      );
    }
    const fareCalculator = FareCalculatorFactory.create(this.date);
    this._fare = fareCalculator.calculate(this._distance);
    this._status = this._status.finish();
    this.apply(new RideFinishedEvent(this.id));
  }
}
