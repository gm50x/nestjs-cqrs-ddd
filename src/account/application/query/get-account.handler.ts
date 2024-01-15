import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../abstractions/account.repository';
import { GetAccountOutput, GetAccountQuery } from './get-account.query';

@QueryHandler(GetAccountQuery)
export class GetAccountHandler
  implements IQueryHandler<GetAccountQuery, GetAccountOutput>
{
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(query: GetAccountQuery): Promise<GetAccountOutput> {
    const account = await this.accountRepository.findById(query.id);
    if (!account) {
      throw new NotFoundException();
    }
    return {
      id: account.id,
      email: account.email.value,
      name: account.name,
      carPlate: account.carPlate?.value,
      isDriver: account.isDriver,
    };
  }
}
