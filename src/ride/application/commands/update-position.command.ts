import { UpdatePositionInput } from '../dtos/update-position.dto';

export class UpdatePositionCommand {
  constructor(readonly data: UpdatePositionInput) {}
}
