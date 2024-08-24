import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { APP_GUARD } from '@nestjs/core';
// import { UserGuard } from './user.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigModule을 import
      inject: [ConfigService], // ConfigService를 inject
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // 환경 변수에서 JWT_SECRET을 가져옴
        signOptions: { expiresIn: '300s' },
      }),
    }),
  ], // UserRepository 제공
  controllers: [UserController],
  providers: [
    UserService,
    // {
    //   provide: APP_GUARD,
    //   useClass: UserGuard,
    // },
  ],
  exports: [TypeOrmModule], // UserRepository를 외부에서 사용할 수 있도록 export
})
export class UserModule {}
