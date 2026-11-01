import { ProjectVisibility } from '../../../common/prisma-enums';
export declare class CreateProjectDto {
    title: string;
    summary?: string;
    description: string;
    visibility?: ProjectVisibility;
    skillIds?: string[];
}
