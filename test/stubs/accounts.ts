import { faker } from '@faker-js/faker';

export function getDriverAccount() {
  const fullName = faker.person.fullName();
  const [firstName, ...lastNames] = fullName.split(' ');
  return {
    name: fullName,
    email: faker.internet.email({
      firstName,
      lastName: lastNames.join('_'),
    }),
    password: faker.internet.password(),
    carPlate: 'ABC-1234',
  };
}

export function getPassengerAccount() {
  const fullName = faker.person.fullName();
  const [firstName, ...lastNames] = fullName.split(' ');
  return {
    name: fullName,
    email: faker.internet.email({
      firstName,
      lastName: lastNames.join('_'),
    }),
    password: faker.internet.password(),
  };
}
