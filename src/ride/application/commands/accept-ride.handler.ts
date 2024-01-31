import { Transactional } from '@gedai/core';
import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountService } from '../abstractions/account.service';
import { RideRepository } from '../abstractions/ride.repository';
import { AcceptRideCommand } from './accept-ride.command';

@CommandHandler(AcceptRideCommand)
export class AcceptRideHandler
  implements ICommandHandler<AcceptRideCommand, void>
{
  constructor(
    private readonly acccountService: AccountService,
    private readonly rideRepository: RideRepository,
  ) {}

  @Transactional()
  async execute({ data }: AcceptRideCommand): Promise<void> {
    const account = await this.acccountService.getById(data.driverId);
    if (!account) {
      throw new UnprocessableEntityException(
        `Account ${data.driverId} does not exist`,
      );
    }
    if (!account.isDriver) {
      throw new UnprocessableEntityException(
        `Account ${data.driverId} is not a driver's account`,
      );
    }
    const activeRides = await this.rideRepository.getActiveRidesByDriverId(
      data.driverId,
    );
    if (activeRides.length > 0) {
      throw new ConflictException(
        `Driver ${data.driverId} already has an active ride`,
      );
    }
    const ride = await this.rideRepository.findById(data.rideId);
    if (!ride) {
      throw new UnprocessableEntityException(
        `Ride ${data.rideId} does not exist`,
      );
    }
    ride.accept(data.driverId);
    await this.rideRepository.update(ride);
    await ride.commit();
  }
}
