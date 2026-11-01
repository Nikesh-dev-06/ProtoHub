import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../prisma-enums';

export const ROLES_KEY = 'roles';

/**
 * Usage: @Roles(UserRole.ADMIN, UserRole.MENTOR)
 * Must be combined with RolesGuard (applied globally in app.module.ts).
 * A route with no @Roles() decorator is accessible to any authenticated user.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
