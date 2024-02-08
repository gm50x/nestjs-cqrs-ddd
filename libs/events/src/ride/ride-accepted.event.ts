import { DomainEvent } from '@gedai/tactical-domain';

export class RideAcceptedEvent extends DomainEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
