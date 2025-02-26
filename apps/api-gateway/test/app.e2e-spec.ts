import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MicroserviceExceptionFilter } from '@app/shared';
import { TeacherModule } from '../src/teacher/teacher.module';
import { AuthModule } from '../src/auth/auth.module';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';

describe('TeacherController (e2e)', () => {
  let app: INestApplication;
  let teacherClient: ClientProxy;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, TeacherModule],
    })
      .overrideProvider('teacher_service')
      .useValue({
        send: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,
        stopAtFirstError: true,
      }),
    );

    app.useGlobalFilters(new MicroserviceExceptionFilter());

    await app.init();

    teacherClient = app.get<ClientProxy>('teacher_service');

    const authResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'john.doe@elm.ai', password: 'supersecret' });

    expect(authResponse.status).toBe(201);
    authToken = authResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/register', () => {
    it('should register students successfully and return 204', async () => {
      jest.spyOn(teacherClient, 'send').mockReturnValue(of(null));

      const response = await request(app.getHttpServer())
        .post('/api/register')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ teacher: 'john.doe@elm.ai', students: ['student1@elm.ai'] });

      expect(response.status).toBe(204);
    });

    it('should return 400 for invalid input', async () => {
      return request(app.getHttpServer())
        .post('/api/register')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ teacher: '', students: [''] })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'Teacher email is required and cannot be empty.',
          );
        });
    });

    it('should return 404 if teacher not found', async () => {
      jest.spyOn(teacherClient, 'send').mockReturnValue(
        throwError(
          () =>
            new RpcException({
              statusCode: 404,
              message:
                'Teacher not found. Please check the provided information.',
            }),
        ),
      );

      const response = await request(app.getHttpServer())
        .post('/api/register')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ teacher: 'notfound@elm.ai', students: ['student1@elm.ai'] });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        'Teacher not found. Please check the provided information.',
      );
    });
  });

  describe('GET /api/commonstudents', () => {
    it('should return common students for given teachers', async () => {
      const teachers = ['teacher1@elm.ai', 'teacher2@elm.ai'];
      const mockResponse = { students: ['student1@elm.ai', 'student2@elm.ai'] };

      (teacherClient.send as jest.Mock).mockReturnValue(of(mockResponse));

      const response = await request(app.getHttpServer())
        .get('/api/commonstudents')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ teacher: teachers });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(mockResponse);
      expect(teacherClient.send).toHaveBeenCalledWith('commonstudents', {
        teachers,
      });
    });
  });

  describe('POST /api/suspend', () => {
    it('should suspend a student successfully', async () => {
      const suspendDto = { student: 'student1@elm.ai' };

      (teacherClient.send as jest.Mock).mockReturnValue(of({}));

      const response = await request(app.getHttpServer())
        .post('/api/suspend')
        .set('Authorization', `Bearer ${authToken}`)
        .send(suspendDto);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);
      expect(teacherClient.send).toHaveBeenCalledWith('suspend', {
        body: suspendDto,
      });
    });

    it('should return 400 if request body is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/suspend')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /api/retrievefornotifications', () => {
    it('should return recipients of a notification', async () => {
      const notificationDto = {
        teacher: 'teacher@elm.ai',
        notification: 'Hello @student1@elm.ai @student2@elm.ai',
      };

      const mockResponse = {
        recipients: ['student1@elm.ai', 'student2@elm.ai', 'student3@elm.ai'],
      };

      (teacherClient.send as jest.Mock).mockReturnValue(of(mockResponse));

      const response = await request(app.getHttpServer())
        .post('/api/retrievefornotifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send(notificationDto);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(mockResponse);
      expect(teacherClient.send).toHaveBeenCalledWith(
        'retrievefornotifications',
        { body: notificationDto },
      );
    });

    it('should return 400 if request body is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/retrievefornotifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
