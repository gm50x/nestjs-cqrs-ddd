import { CoreEvent } from '@gedai/core-ddd';
export class AccountCreatedEvent extends CoreEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
