export interface AuthRequest extends Request {
  user?: UserEntity;
}

import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (field: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();
    const user = req.user;
    return field ? user?.[field as keyof UserEntity] : user;
  },
);
