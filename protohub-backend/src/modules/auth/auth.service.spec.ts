import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../common/prisma-enums';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let authRepository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const meta = { userAgent: 'jest', ipAddress: '127.0.0.1' };

  const buildUser = async (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: 'user-1',
    email: 'priya@protohub.dev',
    passwordHash: await bcrypt.hash('CorrectPass1', 12),
    name: 'Priya Sharma',
    role: UserRole.STUDENT,
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
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            createUser: jest.fn(),
            markLoggedIn: jest.fn(),
          },
        },
        {
          provide: AuthRepository,
          useValue: {
            createRefreshToken: jest.fn(),
            findActiveByHash: jest.fn(),
            revokeById: jest.fn(),
            revokeAllForUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('signed.access.token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, fallback?: string) => {
              const values: Record<string, string> = {
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

    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    authRepository = moduleRef.get(AuthRepository);
    jwtService = moduleRef.get(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('creates a user and returns tokens when the email is not taken', async () => {
      const created = await buildUser();
      usersService.findByEmail.mockResolvedValue(null);
      usersService.createUser.mockResolvedValue(created as any);
      authRepository.createRefreshToken.mockResolvedValue({} as any);

      const result = await authService.register(
        { email: created.email, password: 'CorrectPass1', name: created.name },
        meta,
      );

      expect(usersService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ email: created.email, name: created.name }),
      );
      expect(result.accessToken).toBe('signed.access.token');
      expect(result.refreshToken).toEqual(expect.any(String));
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(authRepository.createRefreshToken).toHaveBeenCalledTimes(1);
    });

    it('throws ConflictException when the email is already registered', async () => {
      usersService.findByEmail.mockResolvedValue(await (buildUser() as any));

      await expect(
        authService.register({ email: 'priya@protohub.dev', password: 'CorrectPass1', name: 'Priya' }, meta),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(usersService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('returns tokens and marks the user logged in on correct credentials', async () => {
      const user = await buildUser();
      usersService.findByEmail.mockResolvedValue(user as any);
      authRepository.createRefreshToken.mockResolvedValue({} as any);

      const result = await authService.login({ email: user.email, password: 'CorrectPass1' }, meta);

      expect(usersService.markLoggedIn).toHaveBeenCalledWith(user.id);
      expect(result.user.email).toBe(user.email);
      expect(result.accessToken).toBeDefined();
    });

    it('throws UnauthorizedException when the user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(authService.login({ email: 'nobody@protohub.dev', password: 'x' }, meta)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when the password is wrong', async () => {
      const user = await buildUser();
      usersService.findByEmail.mockResolvedValue(user as any);

      await expect(authService.login({ email: user.email, password: 'WrongPass1' }, meta)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
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
      } as any);
      authRepository.createRefreshToken.mockResolvedValue({} as any);

      const result = await authService.refresh('some-presented-token', meta);

      expect(authRepository.revokeById).toHaveBeenCalledWith('refresh-1');
      expect(authRepository.createRefreshToken).toHaveBeenCalledTimes(1);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toEqual(expect.any(String));
    });

    it('throws UnauthorizedException for an unknown or expired token', async () => {
      authRepository.findActiveByHash.mockResolvedValue(null);

      await expect(authService.refresh('bogus-token', meta)).rejects.toBeInstanceOf(UnauthorizedException);
      expect(authRepository.revokeById).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('revokes the matching refresh token', async () => {
      authRepository.findActiveByHash.mockResolvedValue({ id: 'refresh-1' } as any);

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
