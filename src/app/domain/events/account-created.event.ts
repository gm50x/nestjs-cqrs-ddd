import { CoreEvent } from '../core/core-event';

export class AccountCreatedEvent extends CoreEvent {
  constructor(readonly userId: string) {
    super();
  }
}
