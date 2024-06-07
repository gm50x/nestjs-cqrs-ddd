import { IntegrationEvent } from '@gedai/nestjs-tactical-design';

export class RideStartedEvent extends IntegrationEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
