import { DomainEvent } from '../domain-event';

export class RideAcceptedEvent extends DomainEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
