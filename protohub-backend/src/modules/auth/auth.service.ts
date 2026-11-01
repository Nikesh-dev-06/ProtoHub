import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService, toPublicUser, PublicUser } from '../users/users.service';
import { UserRole } from '../../common/prisma-enums';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const BCRYPT_SALT_ROUNDS = 12;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends TokenPair {
  user: PublicUser;
}

@Injectable()
export class AuthService {
  private readonly refreshTtlMs: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Default 7 days; overridable via env.
    this.refreshTtlMs = this.parseDurationMs(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'));
  }

  async register(dto: RegisterDto, meta: { userAgent?: string; ipAddress?: string }): Promise<AuthResult> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
    const user = await this.usersService.createUser({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: (dto.role as UserRole) ?? UserRole.STUDENT,
      headline: dto.headline,
    });

    const tokens = await this.issueTokenPair(user.id, user.role, meta);
    return { user: toPublicUser(user), ...tokens };
  }

  async login(dto: LoginDto, meta: { userAgent?: string; ipAddress?: string }): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.usersService.markLoggedIn(user.id);
    const tokens = await this.issueTokenPair(user.id, user.role, meta);
    return { user: toPublicUser(user), ...tokens };
  }

  /**
   * Refresh-token ROTATION: the presented token is revoked and a brand new
   * pair is issued. If a revoked/expired/unknown token is presented, we
   * fail closed — this also catches replay of a stolen-then-rotated token.
   */
  async refresh(refreshToken: string, meta: { userAgent?: string; ipAddress?: string }): Promise<TokenPair> {
    const tokenHash = this.hashToken(refreshToken);
    const record = await this.authRepository.findActiveByHash(tokenHash);

    if (!record) {
      throw new UnauthorizedException('Refresh token is invalid or has expired');
    }

    await this.authRepository.revokeById(record.id);
    return this.issueTokenPair(record.userId, record.user.role, meta);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);
    const record = await this.authRepository.findActiveByHash(tokenHash);
    if (record) {
      await this.authRepository.revokeById(record.id);
    }
    // Intentionally silent if the token was already invalid — logout is idempotent.
  }

  private async issueTokenPair(
    userId: string,
    role: string,
    meta: { userAgent?: string; ipAddress?: string },
  ): Promise<TokenPair> {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, role },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
      },
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');
    await this.authRepository.createRefreshToken({
      userId,
      tokenHash: this.hashToken(refreshToken),
      expiresAt: new Date(Date.now() + this.refreshTtlMs),
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    });

    return { accessToken, refreshToken };
  }

  /** Refresh tokens are opaque random strings — SHA-256 gives a fast, deterministic lookup key. Not used for passwords, which use bcrypt. */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private parseDurationMs(duration: string): number {
    const match = /^(\d+)([smhd])$/.exec(duration);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // fallback: 7 days
    const value = Number(match[1]);
    const unitMs = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[match[2] as 's' | 'm' | 'h' | 'd'];
    return value * unitMs;
  }
}
