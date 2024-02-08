import { DomainEvent } from '@gedai/tactical-domain';

export class RideFinishedEvent extends DomainEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
