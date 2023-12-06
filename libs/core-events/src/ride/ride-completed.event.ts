import { DomainEvent } from '../domain-event';

export class RideCompletedEvent extends DomainEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
