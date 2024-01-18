import { TracingService } from '@gedai/tracing';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import {
  SignUpCommand,
  SignUpResult,
} from '../../../application/commands/sign-up.command';
import {
  SignUpInput,
  SignUpOutput,
} from '../../../application/models/sign-up.model';

function Transactional() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value as (...args) => Promise<unknown>;

    descriptor.value = new Proxy(originalMethod, {
      apply: async (proxyTarget, thisArg, args) => {
        const tracing: TracingService = thisArg.tracing;
        const context = tracing.getContext();
        let session: ClientSession = context.get('session');
        if (!session) {
          const connection: Connection = thisArg.connection;
          session = await connection.startSession();
          session.startTransaction();
          context.set('session', session);
        }

        try {
          const result = await proxyTarget.apply(thisArg, args);
          await session.commitTransaction();
          return result;
        } catch (err) {
          await session.abortTransaction();
          throw err;
        }
      },
    });
  };
}

@Controller({ version: '1' })
export class SignUpController {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectConnection() private readonly connection: Connection,
    private readonly tracing: TracingService,
  ) {}

  @Post('sign-up')
  @Transactional()
  async execute(@Body() data: SignUpInput): Promise<SignUpOutput> {
    const result = await this.commandBus.execute<SignUpCommand, SignUpResult>(
      new SignUpCommand({
        name: data.name,
        email: data.email,
        password: data.password,
        carPlate: data.carPlate,
      }),
    );
    return result.data;
  }
}
