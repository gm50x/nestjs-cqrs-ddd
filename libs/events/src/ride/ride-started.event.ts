import { IntegrationEvent } from '@gedai/tactical-domain';

export class RideStartedEvent extends IntegrationEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
