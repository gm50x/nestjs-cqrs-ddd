export type RideStatusValues =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'CANCELED';

class InvalidStatusTransitionError extends Error {
  constructor() {
    super('Invalid Status Transition');
  }
}

export abstract class RideStatus {
  constructor(protected readonly status: RideStatusValues = 'REQUESTED') {}

  get value() {
    return this.status;
  }

  abstract request(): RideStatus;
  abstract accept(): RideStatus;
  abstract start(): RideStatus;
  abstract finish(): RideStatus;
  abstract cancel(): RideStatus;
}

export class RideCanceledStatus extends RideStatus {
  constructor() {
    super('CANCELED');
  }

  request(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  accept(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  start(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  finish(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  cancel(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
}

export class RideFinishedStatus extends RideStatus {
  constructor() {
    super('FINISHED');
  }

  request(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  accept(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  start(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  finish(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  cancel(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
}

export class RideStartedStatus extends RideStatus {
  constructor() {
    super('IN_PROGRESS');
  }

  finish(): RideStatus {
    return new RideFinishedStatus();
  }
  request(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  accept(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  start(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  cancel(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
}

export class RideAcceptedStatus extends RideStatus {
  constructor() {
    super('ACCEPTED');
  }

  start(): RideStatus {
    return new RideStartedStatus();
  }
  cancel(): RideStatus {
    return new RideCanceledStatus();
  }
  request(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  accept(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  finish(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
}

export class RideRequestedStatus extends RideStatus {
  constructor() {
    super('REQUESTED');
  }

  accept(): RideStatus {
    return new RideAcceptedStatus();
  }
  cancel(): RideStatus {
    return new RideCanceledStatus();
  }
  request(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  start(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
  finish(): RideStatus {
    throw new InvalidStatusTransitionError();
  }
}

export class RideStatusFactory {
  static create(status: RideStatusValues) {
    switch (status) {
      case 'ACCEPTED':
        return new RideAcceptedStatus();
      case 'CANCELED':
        return new RideCanceledStatus();
      case 'FINISHED':
        return new RideFinishedStatus();
      case 'IN_PROGRESS':
        return new RideStartedStatus();
      case 'REQUESTED':
        return new RideRequestedStatus();
      default:
        throw new Error(`Unknown Ride Status: ${status}`);
    }
  }
}
