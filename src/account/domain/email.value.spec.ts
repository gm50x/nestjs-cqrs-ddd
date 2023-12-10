import { faker } from '@faker-js/faker';
import { Email } from './email.value';

describe('Email', () => {
  it('should instanciate with valid email', () => {
    expect(() => new Email(faker.internet.email())).not.toThrow();
  });

  it('should throw when instantiating an invalid email', () => {
    expect(
      () => new Email(faker.internet.email().replace('@', '_AT_')),
    ).toThrow();
  });
});
