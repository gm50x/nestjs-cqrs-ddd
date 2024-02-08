import { DomainEvent } from '@gedai/tactical-domain';

export class RideStartedEvent extends DomainEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
