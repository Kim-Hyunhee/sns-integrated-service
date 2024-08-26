import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserModule } from '../src/modules/user/user.module';

describe('UserContoller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  // 이메일, 비밀번호, 계정을 정확히 입력했을 때
  it('/user/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/user/register')
      .send({
        email: 'djfsjf@naver.com',
        password: '123835#RJKAHSFI',
        account: '1dada',
      })
      .expect(201)
      .expect(
        '{"success":true,"statusCode":201,"message":"회원가입이 완료되었습니다."}',
      );
  });

  // 계정이 중복될 때
  it('/user/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/user/register')
      .send({
        email: 'djfsjf@naver.com',
        password: '123835#RJKAHSFI',
        account: 'dads123afaa',
      })
      .expect(400)
      .expect('{"success":false,"error":"사용 중인 계정입니다."}');
  });

  // 이메일 주소가 올바르지 않을 때
  it('/user/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/user/register')
      .send({
        email: 'djfsjfer.com',
        password: '123835#RJKAHSFI',
        account: 'dadsafaa',
      })
      .expect(400)
      .expect(
        '{"message":["email must be an email"],"error":"Bad Request","statusCode":400}',
      );
  });

  // 비밀번호에 숫자, 문자, 특수문자 중 2가지 이상을 포함하지 않았을 때
  it('/user/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/user/register')
      .send({
        email: 'djfsjfer@naver.com',
        password: '1234567890',
        account: 'dadsafa123123a',
      })
      .expect(400)
      .expect(
        '{"success":false,"error":"비밀번호는 숫자, 문자, 특수 문자 중 2가지 이상을 포함해야 합니다."}',
      );
  });

  // 연속으로 같은 문자를 비밀번호로 입력했을 때
  it('/user/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/user/register')
      .send({
        email: 'djfsjfer@naver.com',
        password: '111#',
        account: '1234dadsafa123123a',
      })
      .expect(400)
      .expect(
        '{"success":false,"error":"비밀번호에는 3회 이상 연속되는 문자 사용이 불가합니다."}',
      );
  });
});
