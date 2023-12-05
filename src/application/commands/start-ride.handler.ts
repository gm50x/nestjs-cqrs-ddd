import { UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RideRepository } from '../abstractions/ride.repository';
import { StartRideCommand } from './start-ride.command';

@CommandHandler(StartRideCommand)
export class StartRideHandler
  implements ICommandHandler<StartRideCommand, void>
{
  constructor(private readonly rideRepository: RideRepository) {}

  async execute(command: StartRideCommand): Promise<void> {
    const ride = await this.rideRepository.findOneById(command.rideId);
    if (!ride) {
      throw new UnprocessableEntityException(
        `Ride ${command.rideId} does not exist`,
      );
    }
    ride.start();
    await this.rideRepository.save(ride);
    ride.commit();
  }
}
