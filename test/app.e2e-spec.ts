// test/app.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = app.get(DataSource);
  });

  // This block now uses a raw SQL query to reset the tables
  beforeEach(async () => {
    // This command truncates all specified tables and cascades to dependent ones,
    // then resets the auto-incrementing counters.
    await dataSource.query(
      'TRUNCATE TABLE "users", "organizations" RESTART IDENTITY CASCADE;',
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign up a new user and then log them in', async () => {
    const userCredentials = {
      email: 'e2e-test@example.com',
      username: 'e2e-test-user',
      password: 'Password123!',
    };

    // 1. Sign up the new user
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userCredentials)
      .expect(201); // Corrected to 201 Created

    // 2. Log in with the same user
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userCredentials.email,
        password: userCredentials.password,
      })
      .expect(200);

    // 3. Assert that the response body contains an access_token
    expect(loginResponse.body).toHaveProperty('access_token');
  });
});