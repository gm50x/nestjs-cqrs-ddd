import { ChangePasswordInput } from '../dtos/change-password.dto';

export class ChangePasswordCommand {
  constructor(readonly data: ChangePasswordInput) {}
}
