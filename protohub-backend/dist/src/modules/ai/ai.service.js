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
exports.AIService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_enums_1 = require("../../common/prisma-enums");
const ai_repository_1 = require("./ai.repository");
const SYSTEM_PROMPT = 'You are the ProtoHub AI Assistant. You help students plan, research, and unblock their collaborative learning projects. Be concise, practical, and encouraging. When asked for code, prefer small, well-explained examples over large dumps.';
const MAX_HISTORY_MESSAGES = 20;
let AIService = class AIService {
    constructor(aiRepository, configService) {
        this.aiRepository = aiRepository;
        this.configService = configService;
    }
    listConversations(userId) {
        return this.aiRepository.listConversations(userId);
    }
    async getConversation(id, userId) {
        const conversation = await this.aiRepository.findConversation(id);
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found');
        if (conversation.userId !== userId)
            throw new common_1.ForbiddenException('This is not your conversation');
        return conversation;
    }
    async deleteConversation(id, userId) {
        const conversation = await this.getConversation(id, userId);
        await this.aiRepository.deleteConversation(conversation.id);
        return { success: true };
    }
    async sendMessage(userId, dto) {
        const conversation = dto.conversationId
            ? await this.getConversation(dto.conversationId, userId)
            : await this.aiRepository.createConversation(userId, dto.projectId, dto.content.slice(0, 60));
        await this.aiRepository.addMessage(conversation.id, prisma_enums_1.AIRole.USER, dto.content);
        const history = 'messages' in conversation ? conversation.messages : [];
        const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);
        const { content: replyContent, tokensUsed } = await this.callOpenAI([
            { role: 'system', content: SYSTEM_PROMPT },
            ...recentHistory.map((m) => ({
                role: m.role.toLowerCase(),
                content: m.content,
            })),
            { role: 'user', content: dto.content },
        ]);
        const assistantMessage = await this.aiRepository.addMessage(conversation.id, prisma_enums_1.AIRole.ASSISTANT, replyContent, tokensUsed);
        await this.aiRepository.touchConversation(conversation.id);
        return { conversationId: conversation.id, message: assistantMessage };
    }
    async callOpenAI(messages) {
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (!apiKey) {
            console.warn('OPENAI_API_KEY is not configured. Returning a mock AI response.');
            return {
                content: "This is a mock response because the OPENAI_API_KEY is not configured in the backend environment variables. Please add it to enable real AI assistant responses.",
                tokensUsed: 0,
            };
        }
        let response;
        try {
            response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: this.configService.get('OPENAI_MODEL', 'gpt-4o-mini'),
                    messages,
                    temperature: 0.4,
                    max_tokens: 800,
                }),
            });
        }
        catch {
            throw new common_1.BadGatewayException('Could not reach the AI provider');
        }
        if (!response.ok) {
            throw new common_1.BadGatewayException(`AI provider returned an error (${response.status})`);
        }
        const data = (await response.json());
        return {
            content: data.choices[0]?.message?.content ?? '(no response)',
            tokensUsed: data.usage?.total_tokens,
        };
    }
};
exports.AIService = AIService;
exports.AIService = AIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_repository_1.AIRepository,
        config_1.ConfigService])
], AIService);
//# sourceMappingURL=ai.service.js.map