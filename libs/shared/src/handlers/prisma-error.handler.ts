import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

export class PrismaErrorHandler {
  static handle(error: any, entity: string): never {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          throw new RpcException({
            statusCode: 404,
            message: `${entity} not found. Please check the provided information.`,
            code: 'NOT_FOUND',
          });
        case 'P2002':
          throw new RpcException({
            statusCode: 409,
            message: `A ${entity} with the same details already exists.`,
            code: 'CONFLICT',
          });
        case 'P2003':
          throw new RpcException({
            statusCode: 400,
            message: `Invalid reference. The related ${entity} does not exist.`,
            code: 'BAD_REQUEST',
          });
        default:
          throw new RpcException({
            statusCode: 400,
            message: `A database error occurred while processing ${entity}.`,
            code: 'BAD_REQUEST',
          });
      }
    }

    throw new RpcException({
      statusCode: 500,
      message: `An unexpected error occurred while handling ${entity}. Please try again later.`,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}
