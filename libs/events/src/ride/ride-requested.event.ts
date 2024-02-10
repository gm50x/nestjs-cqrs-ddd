import { IntegrationEvent } from '@gedai/tactical-domain';

export class RideRequestedEvent extends IntegrationEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
