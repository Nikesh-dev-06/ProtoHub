"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const users_service_1 = require("../users/users.service");
const prisma_enums_1 = require("../../common/prisma-enums");
const auth_repository_1 = require("./auth.repository");
const BCRYPT_SALT_ROUNDS = 12;
let AuthService = class AuthService {
    constructor(usersService, authRepository, jwtService, configService) {
        this.usersService = usersService;
        this.authRepository = authRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.refreshTtlMs = this.parseDurationMs(this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'));
    }
    async register(dto, meta) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException('An account with this email already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
        const user = await this.usersService.createUser({
            email: dto.email,
            passwordHash,
            name: dto.name,
            role: dto.role ?? prisma_enums_1.UserRole.STUDENT,
            headline: dto.headline,
        });
        const tokens = await this.issueTokenPair(user.id, user.role, meta);
        return { user: (0, users_service_1.toPublicUser)(user), ...tokens };
    }
    async login(dto, meta) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        await this.usersService.markLoggedIn(user.id);
        const tokens = await this.issueTokenPair(user.id, user.role, meta);
        return { user: (0, users_service_1.toPublicUser)(user), ...tokens };
    }
    async refresh(refreshToken, meta) {
        const tokenHash = this.hashToken(refreshToken);
        const record = await this.authRepository.findActiveByHash(tokenHash);
        if (!record) {
            throw new common_1.UnauthorizedException('Refresh token is invalid or has expired');
        }
        await this.authRepository.revokeById(record.id);
        return this.issueTokenPair(record.userId, record.user.role, meta);
    }
    async logout(refreshToken) {
        const tokenHash = this.hashToken(refreshToken);
        const record = await this.authRepository.findActiveByHash(tokenHash);
        if (record) {
            await this.authRepository.revokeById(record.id);
        }
    }
    async issueTokenPair(userId, role, meta) {
        const accessToken = await this.jwtService.signAsync({ sub: userId, role }, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
        });
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
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    parseDurationMs(duration) {
        const match = /^(\d+)([smhd])$/.exec(duration);
        if (!match)
            return 7 * 24 * 60 * 60 * 1000;
        const value = Number(match[1]);
        const unitMs = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[match[2]];
        return value * unitMs;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_repository_1.AuthRepository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map