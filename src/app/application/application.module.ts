import { Module } from '@nestjs/common';
import { SignUpModule } from './accounts/accounts.module';

@Module({
  imports: [SignUpModule],
})
export class ApplicationModule {}
