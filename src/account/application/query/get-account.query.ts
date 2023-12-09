export class GetAccountQuery {
  constructor(readonly id: string) {}
}

export class GetAccountOutput {
  id: string;
  name: string;
  email: string;
  carPlate?: string;
  isDriver: boolean;
}
