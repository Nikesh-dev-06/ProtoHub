import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class SendAIMessageDto {
  @IsOptional()
  @IsUUID('4')
  conversationId?: string;

  @IsOptional()
  @IsUUID('4')
  projectId?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  content!: string;
}
