import { Account } from '../dtos/get-account.dto';

export class GetAccountQuery {
  constructor(readonly id: string) {}
}

export class GetAccountOutput extends Account {}
