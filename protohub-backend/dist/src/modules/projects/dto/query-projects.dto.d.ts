import { ProjectStatus, ProjectVisibility } from '../../../common/prisma-enums';
export declare class QueryProjectsDto {
    search?: string;
    status?: ProjectStatus;
    visibility?: ProjectVisibility;
    skillId?: string;
    page: number;
    limit: number;
}
