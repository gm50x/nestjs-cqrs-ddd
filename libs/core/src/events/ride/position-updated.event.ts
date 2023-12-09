import { DomainEvent } from '../domain-event';

export class PositionUpdatedEvent extends DomainEvent {
  constructor(
    readonly rideId: string,
    readonly lat: number,
    readonly long: number,
  ) {
    super();
  }
}
