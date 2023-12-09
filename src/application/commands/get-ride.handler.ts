import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../abstractions/account.repository';
import { RideRepository } from '../abstractions/ride.repository';
import { GetRideQuery, GetRideResult } from './get-ride.query';

@QueryHandler(GetRideQuery)
export class GetRideHandler
  implements IQueryHandler<GetRideQuery, GetRideResult>
{
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly rideRepository: RideRepository,
  ) {}

  async execute(command: GetRideQuery): Promise<GetRideResult> {
    const ride = await this.rideRepository.findOneById(command.rideId);
    if (!ride) {
      throw new NotFoundException(`Ride ${command.rideId} does not exist`);
    }
    const [passenger, driver] = await Promise.all([
      this.accountRepository.findOneById(ride.passengerId),
      ride.driverId ? this.accountRepository.findOneById(ride.driverId) : null,
    ]);

    return {
      id: ride.id,
      date: ride.date,
      status: ride.status.value,
      passenger: {
        id: passenger.id,
        name: passenger.name,
        email: passenger.email.value,
      },
      driver: driver
        ? {
            id: driver.id,
            name: driver.name,
            email: driver.email.value,
            carPlate: driver.carPlate.value,
          }
        : null,
      from: {
        lat: ride.from.lat,
        long: ride.from.long,
      },
      to: {
        lat: ride.to.lat,
        long: ride.to.long,
      },
    };
  }
}
