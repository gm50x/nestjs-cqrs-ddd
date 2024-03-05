import { IntegrationEvent } from '@gedai/tactical-design';

export class RideStartedEvent extends IntegrationEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
