import { IntegrationEvent } from '@gedai/nestjs-tactical-design';

export class RideAcceptedEvent extends IntegrationEvent {
  constructor(readonly rideId: string) {
    super();
  }
}
