import { SignInInput, SignInOutput } from '../models/sign-in.model';

export class SignInCommand {
  constructor(readonly data: SignInInput) {}
}
export class SignInResult {
  constructor(readonly data: SignInOutput) {}
}
