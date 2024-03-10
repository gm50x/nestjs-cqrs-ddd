import { Transactional } from '@gedai/transactional';
import { UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PositionRepository } from '../abstractions/position.repository';
import { RideRepository } from '../abstractions/ride.repository';
import { FinishRideCommand } from './finish-ride.command';

@CommandHandler(FinishRideCommand)
export class FinishRideHandler
  implements ICommandHandler<FinishRideCommand, void>
{
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly positionsRepository: PositionRepository,
  ) {}

  @Transactional()
  async execute({ data }: FinishRideCommand): Promise<void> {
    const [ride, positions] = await Promise.all([
      this.rideRepository.findById(data.rideId),
      this.positionsRepository.findByRideId(data.rideId),
    ]);
    if (!ride) {
      throw new UnprocessableEntityException(
        `Ride ${data.rideId} does not exist`,
      );
    }
    ride.finish(positions);
    await this.rideRepository.update(ride);
    await ride.commit();
  }
}
