import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMentorshipRequestDto {
  @IsUUID('4')
  mentorId!: string;

  @IsOptional()
  @IsUUID('4')
  projectId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
