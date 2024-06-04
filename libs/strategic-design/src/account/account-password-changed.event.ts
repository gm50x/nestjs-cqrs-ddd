import { IntegrationEvent } from '@gedai/nestjs-tactical-design';

export class AccountPasswordChangedEvent extends IntegrationEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
