import { Request } from 'express';
import { PublicUser } from '../users/users.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, req: Request): Promise<import("./auth.service").AuthResult>;
    login(dto: LoginDto, req: Request): Promise<import("./auth.service").AuthResult>;
    refresh(dto: RefreshTokenDto, req: Request): Promise<import("./auth.service").TokenPair>;
    logout(dto: RefreshTokenDto): Promise<void>;
    me(user: PublicUser): PublicUser;
    private requestMeta;
}
