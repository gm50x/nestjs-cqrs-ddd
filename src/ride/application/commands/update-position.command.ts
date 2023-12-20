import { UpdatePositionInput } from '../models/update-position.model';

export class UpdatePositionCommand {
  constructor(readonly data: UpdatePositionInput) {}
}
