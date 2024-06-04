import { IntegrationEvent } from '@gedai/nestjs-tactical-design';

export class RideRequestedEvent extends IntegrationEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
