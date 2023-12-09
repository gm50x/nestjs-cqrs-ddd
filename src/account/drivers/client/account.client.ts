import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetAccountOutput,
  GetAccountQuery,
} from '../../application/query/get-account.query';
import { GetAccountRequest } from '../models/get-account.model';

@Injectable()
export class AccountClient {
  constructor(private readonly queryBus: QueryBus) {}

  getById(input: GetAccountRequest) {
    return this.queryBus.execute<GetAccountQuery, GetAccountOutput>(
      new GetAccountQuery(input.id),
    );
  }
}
