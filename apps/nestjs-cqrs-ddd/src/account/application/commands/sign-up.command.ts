import { SignUpInput, SignUpOutput } from '../dtos/sign-up.dto';

export class SignUpCommand {
  constructor(readonly data: SignUpInput) {}
}
export class SignUpResult {
  constructor(readonly data: SignUpOutput) {}
}
