import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { Coord } from './request-ride.model';

export class UpdatePositionInput {
  @IsString()
  rideId: string;

  @Type(() => Coord)
  @ValidateNested()
  coord: Coord;
}
