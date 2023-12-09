import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetAccountOutput,
  GetAccountQuery,
} from '../../application/query/get-account.query';

@Injectable()
export class AccountClient {
  constructor(private readonly queryBus: QueryBus) {}

  getById(id: string) {
    return this.queryBus.execute<GetAccountQuery, GetAccountOutput>(
      new GetAccountQuery(id),
    );
  }
}
