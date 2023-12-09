import { UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PositionRepository } from '../../../ride/application/abstractions/position.repository';
import { RideRepository } from '../../../ride/application/abstractions/ride.repository';
import { FinishRideCommand } from '../../../ride/application/commands/finish-ride.command';

@CommandHandler(FinishRideCommand)
export class FinishRideHandler
  implements ICommandHandler<FinishRideCommand, void>
{
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly positionsRepository: PositionRepository,
  ) {}

  async execute(command: FinishRideCommand): Promise<void> {
    const [ride, positions] = await Promise.all([
      this.rideRepository.findOneById(command.rideId),
      this.positionsRepository.getByRideId(command.rideId),
    ]);
    if (!ride) {
      throw new UnprocessableEntityException(
        `Ride ${command.rideId} does not exist`,
      );
    }
    ride.finish(positions);
    await this.rideRepository.save(ride);
    ride.commit();
  }
}
