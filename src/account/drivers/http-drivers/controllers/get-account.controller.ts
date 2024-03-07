import { Controller, Get, Logger, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetAccountOutput,
  GetAccountQuery,
} from '../../../application/query/get-account.query';

@Controller({ version: '1' })
export class GetAccountController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly queryBus: QueryBus) {}

  @Get('accounts/:id')
  async execute(@Param('id') accountId: string): Promise<GetAccountOutput> {
    const result = await this.queryBus.execute<
      GetAccountQuery,
      GetAccountOutput
    >(new GetAccountQuery(accountId));

    return result;
  }
}
