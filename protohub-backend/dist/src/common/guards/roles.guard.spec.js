"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const prisma_enums_1 = require("../prisma-enums");
const roles_guard_1 = require("./roles.guard");
describe('RolesGuard', () => {
    let guard;
    let reflector;
    const buildContext = (user) => ({
        switchToHttp: () => ({ getRequest: () => ({ user }) }),
        getHandler: () => jest.fn(),
        getClass: () => jest.fn(),
    });
    beforeEach(() => {
        reflector = { getAllAndOverride: jest.fn() };
        guard = new roles_guard_1.RolesGuard(reflector);
    });
    it('allows the request when no @Roles() decorator is present', () => {
        reflector.getAllAndOverride.mockReturnValue(undefined);
        expect(guard.canActivate(buildContext({ role: prisma_enums_1.UserRole.STUDENT }))).toBe(true);
    });
    it('allows the request when the user has one of the required roles', () => {
        reflector.getAllAndOverride.mockReturnValue([prisma_enums_1.UserRole.ADMIN, prisma_enums_1.UserRole.MENTOR]);
        expect(guard.canActivate(buildContext({ role: prisma_enums_1.UserRole.MENTOR }))).toBe(true);
    });
    it('throws ForbiddenException when the user lacks the required role', () => {
        reflector.getAllAndOverride.mockReturnValue([prisma_enums_1.UserRole.ADMIN]);
        expect(() => guard.canActivate(buildContext({ role: prisma_enums_1.UserRole.STUDENT }))).toThrow(common_1.ForbiddenException);
    });
    it('throws ForbiddenException when there is no authenticated user at all', () => {
        reflector.getAllAndOverride.mockReturnValue([prisma_enums_1.UserRole.ADMIN]);
        expect(() => guard.canActivate(buildContext(undefined))).toThrow(common_1.ForbiddenException);
    });
});
//# sourceMappingURL=roles.guard.spec.js.map