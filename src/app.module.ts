import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedModule } from './modules/feed/feed.module';
import { UserModule } from './modules/user/user.module';
import { VerificationModule } from './modules/verification/verification.module';


@Module({
  imports: [FeedModule, UserModule, VerificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
