import { SignInInput, SignInOutput } from '../dtos/sign-in.dto';

export class SignInCommand {
  constructor(readonly data: SignInInput) {}
}
export class SignInResult {
  constructor(readonly data: SignInOutput) {}
}
