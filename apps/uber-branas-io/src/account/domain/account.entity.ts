import { Entity } from '@gedai/nestjs-tactical-design';
import {
  AccountAuthenticatedEvent,
  AccountPasswordChangedEvent,
} from '@gedai/strategic-design';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { CarPlate } from './car-plate.value';
import { Email } from './email.value';
import { Password, PasswordFactory } from './password.value';
import { Token, TokenFactory } from './token.value';

export class Account extends Entity {
  constructor(
    protected readonly _id: string,
    private readonly _name: string,
    private readonly _email: Email,
    private _password: Password,
    private readonly _carPlate?: CarPlate,
    private _token?: Token,
  ) {
    super(_id);
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get carPlate() {
    return this._carPlate;
  }

  get token() {
    return this._token;
  }

  get isDriver() {
    return Boolean(this._carPlate);
  }

  changePassword(currentPassword: string, newPassword: string) {
    if (!this._password.validate(currentPassword)) {
      throw new ForbiddenException();
    }
    const Password = PasswordFactory.create('pbkdf2');
    this._password = new Password(
      newPassword,
      PasswordFactory.generateSalt(),
      true,
    );
    this.apply(new AccountPasswordChangedEvent(this._id));
  }

  authenticate(password: string) {
    if (!this._password.validate(password)) {
      throw new UnauthorizedException();
    }
    const Token = TokenFactory.create('aes-256-gcm');
    this._token = new Token();
    this._token.encrypt(password);
    this.apply(new AccountAuthenticatedEvent(this._id));
    return this._token;
  }
}
