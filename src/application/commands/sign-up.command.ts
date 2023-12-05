export class SignUpCommand {
  constructor(
    readonly name: string,
    readonly email: string,
    readonly password: string,
    readonly carPlate?: string,
  ) {}
}
export class SignUpResult {
  constructor(readonly id: string) {}
}
