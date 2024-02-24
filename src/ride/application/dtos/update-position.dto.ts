import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { Coord } from './ride.dto';

export class UpdatePositionInput {
  @IsString()
  rideId: string;

  @Type(() => Coord)
  @ValidateNested()
  coord: Coord;
}
