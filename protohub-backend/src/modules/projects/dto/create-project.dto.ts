import { ArrayMaxSize, IsArray, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ProjectVisibility } from '../../../common/prisma-enums';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  summary?: string;

  @IsString()
  @MinLength(20, { message: 'Give teammates enough context to know if they want to join — at least 20 characters' })
  @MaxLength(5000)
  description!: string;

  @IsOptional()
  @IsEnum(ProjectVisibility)
  visibility?: ProjectVisibility;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsUUID('4', { each: true })
  skillIds?: string[];
}
