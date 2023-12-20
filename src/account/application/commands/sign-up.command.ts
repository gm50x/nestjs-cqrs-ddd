import { SignUpInput, SignUpOutput } from '../models/sign-up.model';

export class SignUpCommand {
  constructor(readonly data: SignUpInput) {}
}
export class SignUpResult {
  constructor(readonly data: SignUpOutput) {}
}
