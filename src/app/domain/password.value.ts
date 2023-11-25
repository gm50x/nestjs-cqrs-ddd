import { createHash, randomBytes } from 'crypto';

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

  constructor(value: string, salt: string, isNew: boolean) {
    this.salt = salt;
    this.value = isNew ? this.createHash(value, salt) : value;
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
  static generateSalt() {
    return randomBytes(36).toString('hex');
  }
  static create(algorithm: PasswordAlgorithm) {
    switch (algorithm) {
      case 'plain':
        return PlainPassword;
      case 'sha256':
        return SHA256Password;
      default:
        throw new Error(`${algorithm} is not a valid Password Algorithm`);
    }
  }
}
