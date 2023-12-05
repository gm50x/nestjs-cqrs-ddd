import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../abstractions/account.repository';
import { RideRepository } from '../abstractions/ride.repository';
import { AcceptRideCommand } from './accept-ride.command';

@CommandHandler(AcceptRideCommand)
export class AcceptRideHandler
  implements ICommandHandler<AcceptRideCommand, void>
{
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly rideRepository: RideRepository,
  ) {}

  async execute(command: AcceptRideCommand): Promise<void> {
    const account = await this.accountRepository.findOneById(command.driverId);

    if (!account) {
      throw new UnprocessableEntityException(
        `Account ${command.driverId} does not exist`,
      );
    }
    if (!account.isDriver) {
      throw new UnprocessableEntityException(
        `Account ${command.driverId} is not a driver's account`,
      );
    }
    const activeRides = await this.rideRepository.getActiveRidesByDriverId(
      command.driverId,
    );
    if (activeRides.length > 0) {
      throw new ConflictException(
        `Driver ${command.driverId} already has an active ride`,
      );
    }
    const ride = await this.rideRepository.findOneById(command.rideId);
    if (!ride) {
      throw new UnprocessableEntityException(
        `Ride ${command.rideId} does not exist`,
      );
    }
    ride.accept(command.driverId);
    await this.rideRepository.save(ride);
    ride.commit();
  }
}
