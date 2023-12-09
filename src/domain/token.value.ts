import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  randomUUID,
} from 'crypto';

export type TokenAlgorithm = 'aes-256-gcm' | 'aes-256-cbc' | 'plain';

export interface Token {
  readonly algorithm: TokenAlgorithm;
  readonly meta?: string;
  readonly value: string;
  encrypt(password: string): void;
  decrypt(password: string): void;
}

export class PlainToken implements Token {
  readonly algorithm = 'plain';
  private _value: string;

  constructor() {
    this._value = randomUUID();
  }

  get value(): string {
    return this._value;
  }

  encrypt(): void {
    this._value = `${this._value}`;
  }

  decrypt(): void {
    this._value = `${this._value}`;
  }
}

export class AES256CBCToken implements Token {
  private _value: string;
  readonly algorithm: TokenAlgorithm = 'aes-256-cbc';
  meta?: string;

  constructor(value?: string, meta?: string) {
    this._value = value ?? randomUUID();
    this.meta = meta;
  }

  get value(): string {
    return this._value;
  }

  encrypt(password: string): void {
    const token = randomUUID();
    const initializationVector = randomBytes(16);
    const key = createHash('sha256').update(password).digest('hex');

    const cipher = createCipheriv(
      this.algorithm,
      Buffer.from(key, 'hex'),
      initializationVector,
    );

    const hydratedCipher = cipher.update(Buffer.from(token, 'utf-8'));
    const finalCipher = cipher.final();
    const encryption = Buffer.concat([hydratedCipher, finalCipher]);

    this.meta = initializationVector.toString('hex');
    this._value = encryption.toString('hex');
  }

  decrypt(password: string): void {
    if (!this.meta) {
      throw new Error('Token has not yet been encrypted');
    }
    const encryption = this.value;
    const key = createHash('sha256').update(password).digest('hex');
    const decipher = createDecipheriv(
      this.algorithm,
      Buffer.from(key, 'hex'),
      Buffer.from(this.meta, 'hex'),
    );
    const hidratedDecipher = decipher.update(Buffer.from(encryption, 'hex'));
    const finalDecipher = decipher.final();
    const decryption = Buffer.concat([hidratedDecipher, finalDecipher]);

    this.meta = null;
    this._value = decryption.toString('utf-8');
  }
}

export class AES256GCMToken implements Token {
  private _value: string;
  readonly algorithm = 'aes-256-gcm';
  meta?: string;

  constructor(value?: string, meta?: string) {
    this._value = value ?? randomUUID();
    this.meta = meta;
  }

  get value(): string {
    return this._value;
  }

  encrypt(password: string): void {
    const token = randomUUID();
    const initializationVector = randomBytes(16);
    const key = createHash('sha256').update(password).digest('hex');

    const cipher = createCipheriv(
      this.algorithm,
      Buffer.from(key, 'hex'),
      initializationVector,
    );

    const hydratedCipher = cipher.update(Buffer.from(token, 'utf-8'));
    const finalCipher = cipher.final();
    const encryption = Buffer.concat([hydratedCipher, finalCipher]);

    this.meta = [
      initializationVector.toString('hex'),
      cipher.getAuthTag().toString('hex'),
    ].join('.');
    this._value = encryption.toString('hex');
  }

  decrypt(password: string): void {
    if (!this.meta) {
      throw new Error('Token has not yet been encrypted');
    }
    const [initializationVector, authTag] = this.meta
      .split('.')
      .map((x) => Buffer.from(x, 'hex'));

    const encryption = this.value;
    const key = createHash('sha256').update(password).digest('hex');
    const decipher = createDecipheriv(
      this.algorithm,
      Buffer.from(key, 'hex'),
      initializationVector,
    );
    decipher.setAuthTag(authTag);
    const hidratedDecipher = decipher.update(Buffer.from(encryption, 'hex'));
    const finalDecipher = decipher.final();
    const decryption = Buffer.concat([hidratedDecipher, finalDecipher]);

    this.meta = null;
    this._value = decryption.toString('utf-8');
  }
}

export class TokenFactory {
  static create(algorithm: TokenAlgorithm) {
    switch (algorithm) {
      case 'plain':
        return PlainToken;
      case 'aes-256-cbc':
        return AES256CBCToken;
      case 'aes-256-gcm':
        return AES256GCMToken;
      default:
        throw new Error(`${algorithm} is not a valid Password Algorithm`);
    }
  }
}
