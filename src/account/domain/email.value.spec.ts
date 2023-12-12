import { faker } from '@faker-js/faker';
import { getPassengerAccount } from '@gedai/stub-factory/accounts';
import { Email } from './email.value';

describe('Email', () => {
  it('should instanciate with valid email', () => {
    expect(() => new Email(faker.internet.email())).not.toThrow();
  });

  it('should work with central stubs directory', () => {
    const { email } = getPassengerAccount();
    expect(() => new Email(email)).not.toThrow();
  });

  it('should throw when instantiating an invalid email', () => {
    expect(
      () => new Email(faker.internet.email().replace('@', '_AT_')),
    ).toThrow();
  });
});
