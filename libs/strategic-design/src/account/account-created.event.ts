import { IntegrationEvent } from '@gedai/nestjs-tactical-design';

export class AccountCreatedEvent extends IntegrationEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
