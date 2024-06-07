import { IntegrationEvent } from '@gedai/nestjs-tactical-design';

export class AccountAuthenticatedEvent extends IntegrationEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
