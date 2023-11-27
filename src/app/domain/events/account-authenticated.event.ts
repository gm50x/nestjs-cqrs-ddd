import { CoreEvent } from '@gedai/core-ddd';

export class AccountAuthenticatedEvent extends CoreEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
