export class SignInCommand {
  constructor(
    readonly email: string,
    readonly password: string,
  ) {}
}
export class SignInResult {
  constructor(readonly access_token: string) {}
}
