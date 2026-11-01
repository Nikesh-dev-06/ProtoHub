import { IsEnum } from 'class-validator';
import { ProjectMemberRole } from '../../../common/prisma-enums';

export class UpdateMemberRoleDto {
  @IsEnum(ProjectMemberRole)
  role!: ProjectMemberRole;
}
