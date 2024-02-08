import { DomainEvent } from '@gedai/tactical-domain';

export class RideRequestedEvent extends DomainEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
