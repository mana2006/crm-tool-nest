import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ClientInfo = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return {
      ip: req.ip,
      userAgent: req.headers['user-agent']?.slice(0, 255),
    };
  },
);
