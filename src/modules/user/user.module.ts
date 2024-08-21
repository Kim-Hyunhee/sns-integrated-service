import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // UserRepository 제공
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule], // UserRepository를 외부에서 사용할 수 있도록 export
})
export class UserModule {}
