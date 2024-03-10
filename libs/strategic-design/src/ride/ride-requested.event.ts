import { IntegrationEvent } from '@gedai/tactical-design';

export class RideRequestedEvent extends IntegrationEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
