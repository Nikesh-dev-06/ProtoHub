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
exports.AIRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AIRepository = class AIRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createConversation(userId, projectId, title) {
        return this.prisma.aIConversation.create({ data: { userId, projectId, title } });
    }
    findConversation(id) {
        return this.prisma.aIConversation.findUnique({
            where: { id },
            include: { messages: { orderBy: { createdAt: 'asc' } } },
        });
    }
    listConversations(userId) {
        return this.prisma.aIConversation.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
    }
    addMessage(conversationId, role, content, tokensUsed) {
        return this.prisma.aIMessage.create({ data: { conversationId, role, content, tokensUsed } });
    }
    touchConversation(id) {
        return this.prisma.aIConversation.update({ where: { id }, data: { updatedAt: new Date() } });
    }
    deleteConversation(id) {
        return this.prisma.aIConversation.delete({ where: { id } });
    }
};
exports.AIRepository = AIRepository;
exports.AIRepository = AIRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AIRepository);
//# sourceMappingURL=ai.repository.js.map