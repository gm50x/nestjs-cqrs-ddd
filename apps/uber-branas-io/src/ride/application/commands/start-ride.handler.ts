import { Transactional } from '@gedai/nestjs-tactical-design';
import { UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RideRepository } from '../abstractions/ride.repository';
import { StartRideCommand } from './start-ride.command';

@CommandHandler(StartRideCommand)
export class StartRideHandler
  implements ICommandHandler<StartRideCommand, void>
{
  constructor(private readonly rideRepository: RideRepository) {}

  @Transactional()
  async execute({ data }: StartRideCommand): Promise<void> {
    const ride = await this.rideRepository.findById(data.rideId);
    if (!ride) {
      throw new UnprocessableEntityException(
        `Ride ${data.rideId} does not exist`,
      );
    }
    ride.start();
    await this.rideRepository.update(ride);
    await ride.commit();
  }
}
