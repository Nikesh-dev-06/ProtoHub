import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService, PublicUser } from '../users/users.service';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export interface AuthResult extends TokenPair {
    user: PublicUser;
}
export declare class AuthService {
    private readonly usersService;
    private readonly authRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly refreshTtlMs;
    constructor(usersService: UsersService, authRepository: AuthRepository, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto, meta: {
        userAgent?: string;
        ipAddress?: string;
    }): Promise<AuthResult>;
    login(dto: LoginDto, meta: {
        userAgent?: string;
        ipAddress?: string;
    }): Promise<AuthResult>;
    refresh(refreshToken: string, meta: {
        userAgent?: string;
        ipAddress?: string;
    }): Promise<TokenPair>;
    logout(refreshToken: string): Promise<void>;
    private issueTokenPair;
    private hashToken;
    private parseDurationMs;
}
