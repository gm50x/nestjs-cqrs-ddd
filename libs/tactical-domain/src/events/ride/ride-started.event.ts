import { DomainEvent } from '../domain-event';

export class RideStartedEvent extends DomainEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
