import { DomainEvent } from '../domain-event';

export class RideFinishedEvent extends DomainEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
