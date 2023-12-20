import { ChangePasswordInput } from '../models/change-password.model';

export class ChangePasswordCommand {
  constructor(readonly data: ChangePasswordInput) {}
}
