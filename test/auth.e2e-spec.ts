import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const emailRequest = 'testqwerty@test.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: emailRequest, password: 'qwerty' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(emailRequest);
      });
  });

  it('login as a new user then get currently logged user', async () => {
    const emailRequest = 'adasda@dasdasd.com';
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: emailRequest, password: 'qwerty' })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(emailRequest);
  });
});
