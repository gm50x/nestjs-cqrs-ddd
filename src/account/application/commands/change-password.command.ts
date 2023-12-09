export class ChangePasswordCommand {
  constructor(
    readonly email: string,
    readonly currentPassword: string,
    readonly newPassword: string,
  ) {}
}
