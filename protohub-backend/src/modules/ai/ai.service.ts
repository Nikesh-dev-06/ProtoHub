import { BadGatewayException, ForbiddenException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIRole } from '../../common/prisma-enums';
import { AIRepository } from './ai.repository';
import { SendAIMessageDto } from './dto/send-ai-message.dto';

const SYSTEM_PROMPT =
  'You are the ProtoHub AI Assistant. You help students plan, research, and unblock their collaborative learning projects. Be concise, practical, and encouraging. When asked for code, prefer small, well-explained examples over large dumps.';

// Cap history sent to the model — keeps token cost bounded on long-running conversations.
const MAX_HISTORY_MESSAGES = 20;

@Injectable()
export class AIService {
  constructor(
    private readonly aiRepository: AIRepository,
    private readonly configService: ConfigService,
  ) {}

  /** Returns true when AI features are enabled via environment configuration. */
  private get aiFeaturesEnabled(): boolean {
    return this.configService.get<string>('AI_FEATURES_ENABLED', 'false').toLowerCase() === 'true';
  }

  listConversations(userId: string) {
    return this.aiRepository.listConversations(userId);
  }

  async getConversation(id: string, userId: string) {
    const conversation = await this.aiRepository.findConversation(id);
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.userId !== userId) throw new ForbiddenException('This is not your conversation');
    return conversation;
  }

  async deleteConversation(id: string, userId: string) {
    const conversation = await this.getConversation(id, userId);
    await this.aiRepository.deleteConversation(conversation.id);
    return { success: true };
  }

  async sendMessage(userId: string, dto: SendAIMessageDto) {
    // Maintenance mode guard — block AI processing before any external call.
    // This prevents fake responses, provider errors, and unintended API usage
    // while integration and validation are in progress.
    if (!this.aiFeaturesEnabled) {
      throw new ServiceUnavailableException(
        'AI features are currently unavailable. Integration and validation are in progress. Please try again later.',
      );
    }

    const conversation = dto.conversationId
      ? await this.getConversation(dto.conversationId, userId)
      : await this.aiRepository.createConversation(userId, dto.projectId, dto.content.slice(0, 60));

    await this.aiRepository.addMessage(conversation.id, AIRole.USER, dto.content);

    const history = 'messages' in conversation ? conversation.messages : [];
    const recentHistory: { role: AIRole; content: string }[] = (history as any[]).slice(-MAX_HISTORY_MESSAGES);

    const { content: replyContent, tokensUsed } = await this.callOpenAI([
      { role: 'system', content: SYSTEM_PROMPT },
      ...recentHistory.map((m: { role: AIRole; content: string }) => ({
        role: m.role.toLowerCase() as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: dto.content },
    ]);

    const assistantMessage = await this.aiRepository.addMessage(
      conversation.id,
      AIRole.ASSISTANT,
      replyContent,
      tokensUsed,
    );
    await this.aiRepository.touchConversation(conversation.id);

    return { conversationId: conversation.id, message: assistantMessage };
  }

  private async callOpenAI(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  ): Promise<{ content: string; tokensUsed?: number }> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      // No API key — throw a clear error rather than returning a misleading mock response.
      throw new ServiceUnavailableException(
        'AI service is not configured. The OPENAI_API_KEY environment variable is missing.',
      );
    }

    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: this.configService.get<string>('OPENAI_MODEL', 'gpt-4o-mini'),
          messages,
          temperature: 0.4,
          max_tokens: 800,
        }),
        signal: AbortSignal.timeout(30_000), // 30-second timeout — prevents indefinite hangs
      });
    } catch {
      throw new BadGatewayException('Could not reach the AI provider');
    }

    if (!response.ok) {
      throw new BadGatewayException(`AI provider returned an error (${response.status})`);
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
      usage?: { total_tokens: number };
    };

    return {
      content: data.choices[0]?.message?.content ?? '(no response)',
      tokensUsed: data.usage?.total_tokens,
    };
  }
}
