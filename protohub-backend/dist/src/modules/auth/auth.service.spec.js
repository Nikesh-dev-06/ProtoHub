"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const prisma_enums_1 = require("../../common/prisma-enums");
const auth_service_1 = require("./auth.service");
const auth_repository_1 = require("./auth.repository");
const users_service_1 = require("../users/users.service");
describe('AuthService', () => {
    let authService;
    let usersService;
    let authRepository;
    let jwtService;
    const meta = { userAgent: 'jest', ipAddress: '127.0.0.1' };
    const buildUser = async (overrides = {}) => ({
        id: 'user-1',
        email: 'priya@protohub.dev',
        passwordHash: await bcrypt.hash('CorrectPass1', 12),
        name: 'Priya Sharma',
        role: prisma_enums_1.UserRole.STUDENT,
        headline: null,
        bio: null,
        avatarUrl: null,
        location: null,
        isVerified: false,
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...overrides,
    });
    beforeEach(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: users_service_1.UsersService,
                    useValue: {
                        findByEmail: jest.fn(),
                        findById: jest.fn(),
                        createUser: jest.fn(),
                        markLoggedIn: jest.fn(),
                    },
                },
                {
                    provide: auth_repository_1.AuthRepository,
                    useValue: {
                        createRefreshToken: jest.fn(),
                        findActiveByHash: jest.fn(),
                        revokeById: jest.fn(),
                        revokeAllForUser: jest.fn(),
                    },
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: {
                        signAsync: jest.fn().mockResolvedValue('signed.access.token'),
                    },
                },
                {
                    provide: config_1.ConfigService,
                    useValue: {
                        get: jest.fn((key, fallback) => {
                            const values = {
                                JWT_ACCESS_SECRET: 'test-secret',
                                JWT_ACCESS_EXPIRES_IN: '15m',
                                JWT_REFRESH_EXPIRES_IN: '7d',
                            };
                            return values[key] ?? fallback;
                        }),
                    },
                },
            ],
        }).compile();
        authService = moduleRef.get(auth_service_1.AuthService);
        usersService = moduleRef.get(users_service_1.UsersService);
        authRepository = moduleRef.get(auth_repository_1.AuthRepository);
        jwtService = moduleRef.get(jwt_1.JwtService);
    });
    afterEach(() => jest.clearAllMocks());
    describe('register', () => {
        it('creates a user and returns tokens when the email is not taken', async () => {
            const created = await buildUser();
            usersService.findByEmail.mockResolvedValue(null);
            usersService.createUser.mockResolvedValue(created);
            authRepository.createRefreshToken.mockResolvedValue({});
            const result = await authService.register({ email: created.email, password: 'CorrectPass1', name: created.name }, meta);
            expect(usersService.createUser).toHaveBeenCalledWith(expect.objectContaining({ email: created.email, name: created.name }));
            expect(result.accessToken).toBe('signed.access.token');
            expect(result.refreshToken).toEqual(expect.any(String));
            expect(result.user).not.toHaveProperty('passwordHash');
            expect(authRepository.createRefreshToken).toHaveBeenCalledTimes(1);
        });
        it('throws ConflictException when the email is already registered', async () => {
            usersService.findByEmail.mockResolvedValue(await buildUser());
            await expect(authService.register({ email: 'priya@protohub.dev', password: 'CorrectPass1', name: 'Priya' }, meta)).rejects.toBeInstanceOf(common_1.ConflictException);
            expect(usersService.createUser).not.toHaveBeenCalled();
        });
    });
    describe('login', () => {
        it('returns tokens and marks the user logged in on correct credentials', async () => {
            const user = await buildUser();
            usersService.findByEmail.mockResolvedValue(user);
            authRepository.createRefreshToken.mockResolvedValue({});
            const result = await authService.login({ email: user.email, password: 'CorrectPass1' }, meta);
            expect(usersService.markLoggedIn).toHaveBeenCalledWith(user.id);
            expect(result.user.email).toBe(user.email);
            expect(result.accessToken).toBeDefined();
        });
        it('throws UnauthorizedException when the user does not exist', async () => {
            usersService.findByEmail.mockResolvedValue(null);
            await expect(authService.login({ email: 'nobody@protohub.dev', password: 'x' }, meta)).rejects.toBeInstanceOf(common_1.UnauthorizedException);
        });
        it('throws UnauthorizedException when the password is wrong', async () => {
            const user = await buildUser();
            usersService.findByEmail.mockResolvedValue(user);
            await expect(authService.login({ email: user.email, password: 'WrongPass1' }, meta)).rejects.toBeInstanceOf(common_1.UnauthorizedException);
            expect(usersService.markLoggedIn).not.toHaveBeenCalled();
        });
    });
    describe('refresh', () => {
        it('rotates the token: revokes the old one and issues a new pair', async () => {
            const user = await buildUser();
            authRepository.findActiveByHash.mockResolvedValue({
                id: 'refresh-1',
                userId: user.id,
                user,
            });
            authRepository.createRefreshToken.mockResolvedValue({});
            const result = await authService.refresh('some-presented-token', meta);
            expect(authRepository.revokeById).toHaveBeenCalledWith('refresh-1');
            expect(authRepository.createRefreshToken).toHaveBeenCalledTimes(1);
            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toEqual(expect.any(String));
        });
        it('throws UnauthorizedException for an unknown or expired token', async () => {
            authRepository.findActiveByHash.mockResolvedValue(null);
            await expect(authService.refresh('bogus-token', meta)).rejects.toBeInstanceOf(common_1.UnauthorizedException);
            expect(authRepository.revokeById).not.toHaveBeenCalled();
        });
    });
    describe('logout', () => {
        it('revokes the matching refresh token', async () => {
            authRepository.findActiveByHash.mockResolvedValue({ id: 'refresh-1' });
            await authService.logout('some-token');
            expect(authRepository.revokeById).toHaveBeenCalledWith('refresh-1');
        });
        it('is idempotent when the token is already invalid', async () => {
            authRepository.findActiveByHash.mockResolvedValue(null);
            await expect(authService.logout('already-gone')).resolves.toBeUndefined();
            expect(authRepository.revokeById).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map