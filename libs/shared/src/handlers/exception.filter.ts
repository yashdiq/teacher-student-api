import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class MicroserviceExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const error = exception.getError() as any;

    const status = error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error?.message || 'Internal server error';
    const code = error?.code || 'INTERNAL_ERROR';

    response.status(status).json({ statusCode: status, message, code });
  }
}
