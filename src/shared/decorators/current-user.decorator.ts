// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { Request } from 'express';
// import { AuthUser } from '@shared/dto';
// import type { TenantPrincipal } from '@modules/tenant-authorization/domain/tenant-authorization';

// export interface AuthRequest extends Request {
//     user: AuthUser;
//     tenantPrincipal?: TenantPrincipal;
// }

// export const CurrentUser = createParamDecorator(
//     (data: string | undefined, ctx: ExecutionContext) => {
//         const request = ctx.switchToHttp().getRequest<AuthRequest>();
//         const user = request.user;

//         if (!user) return null;
//         return data ? user[data as keyof typeof user] : user;
//     },
// );

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
