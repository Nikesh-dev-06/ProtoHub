import { IsInt, IsOptional, IsString, IsUUID, IsUrl, Min } from 'class-validator';

export class CreateAttachmentDto {
  @IsUrl()
  url!: string;

  @IsString()
  publicId!: string;

  @IsString()
  fileName!: string;

  @IsString()
  mimeType!: string;

  @IsInt()
  @Min(1)
  fileSize!: number;

  @IsOptional()
  @IsUUID('4')
  projectId?: string;

  @IsOptional()
  @IsUUID('4')
  taskId?: string;
}
