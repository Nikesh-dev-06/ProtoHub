import { IsEnum, IsUUID, IsOptional, IsString } from 'class-validator';
import { SkillProficiency } from '../../../common/prisma-enums';

export class AddSkillDto {
  @IsOptional()
  @IsUUID('4')
  skillId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(SkillProficiency)
  proficiency?: SkillProficiency;
}
