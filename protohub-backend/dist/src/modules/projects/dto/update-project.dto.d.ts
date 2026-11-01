import { ProjectStatus, ProjectVisibility } from '../../../common/prisma-enums';
export declare class UpdateProjectDto {
    title?: string;
    summary?: string;
    description?: string;
    coverImageUrl?: string;
    repositoryUrl?: string;
    status?: ProjectStatus;
    visibility?: ProjectVisibility;
    skillIds?: string[];
}
