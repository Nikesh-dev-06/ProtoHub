import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PublicUser } from '../../modules/users/users.service';

/**
 * Usage: findMyProjects(@CurrentUser() user: PublicUser)
 * Populated by JwtStrategy.validate() — see auth/strategies/jwt.strategy.ts
 */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): PublicUser => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
