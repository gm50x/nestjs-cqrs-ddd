import { faker } from '@faker-js/faker';

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

export function getRequestRide(passengerId: string) {
  return {
    passengerId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  };
}
