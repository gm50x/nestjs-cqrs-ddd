import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccountService } from '../abstractions/account.service';
import { RideRepository } from '../abstractions/ride.repository';
import { GetRideQuery, GetRideResult } from './get-ride.query';

@QueryHandler(GetRideQuery)
export class GetRideHandler
  implements IQueryHandler<GetRideQuery, GetRideResult>
{
  constructor(
    private readonly accountService: AccountService,
    private readonly rideRepository: RideRepository,
  ) {}

  async execute({ data }: GetRideQuery): Promise<GetRideResult> {
    const ride = await this.rideRepository.findById(data.rideId);
    if (!ride) {
      throw new NotFoundException(`Ride ${data.rideId} does not exist`);
    }
    const [passenger, driver] = await Promise.all([
      this.accountService.getById(ride.passengerId),
      ride.driverId ? this.accountService.getById(ride.driverId) : null,
    ]);

    return new GetRideResult({
      id: ride.id,
      date: ride.date,
      status: ride.status.value,
      fare: ride.fare,
      distance: ride.distance,
      passenger: {
        id: passenger.id,
        name: passenger.name,
        email: passenger.email,
      },
      driver: driver
        ? {
            id: driver.id,
            name: driver.name,
            email: driver.email,
            carPlate: driver.carPlate,
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
    });
  }
}
