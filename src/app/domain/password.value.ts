import { Type } from '@nestjs/common';
import { createHash } from 'crypto';

export type PasswordAlgorithm = 'sha256' | 'plain';

export interface Password {
  readonly value: string;
  readonly salt: string;
  readonly algorithm: PasswordAlgorithm;
  validate(password: string): boolean;
}

export class PlainPassword implements Password {
  readonly algorithm = 'plain';

  constructor(
    readonly value: string,
    readonly salt: string,
  ) {}

  validate(password: string): boolean {
    return this.value === password;
  }
}

export class SHA256Password implements Password {
  readonly value: string;
  readonly salt: string;
  readonly algorithm = 'sha256';

  constructor(value: string, salt: string) {
    this.salt = salt;
    this.value = this.createHash(value, salt);
  }

  private createHash(value: string, salt: string) {
    return createHash(this.algorithm).update(`${value}${salt}`).digest('hex');
  }

  validate(password: string): boolean {
    const hash = this.createHash(password, this.salt);
    return this.value === hash;
  }
}

export class PasswordFactory {
  static create(algorithm: PasswordAlgorithm) {
    const algorithms = new Map<PasswordAlgorithm, Type<Password>>()
      .set('plain', PlainPassword)
      .set('sha256', SHA256Password);

    const Target = algorithms.get(algorithm);

    if (!Target) {
      throw new Error(`${algorithm} is not a valid Password Algorithm`);
    }

    return Target;
  }
}
