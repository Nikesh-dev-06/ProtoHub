import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { SetUserActiveDto } from './set-user-active.dto';
export declare class AdminController {
    private readonly usersService;
    private readonly projectsService;
    constructor(usersService: UsersService, projectsService: ProjectsService);
    listUsers(page?: string, limit?: string): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            email: string;
            role: string;
            isVerified: boolean;
            isActive: boolean;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    setUserActive(id: string, dto: SetUserActiveDto): Promise<import("../users/users.service").PublicUser>;
    listProjects(page?: string, limit?: string): Promise<{
        data: ({
            skills: ({
                skill: {
                    id: string;
                    name: string;
                    category: string | null;
                    createdAt: Date;
                };
            } & {
                skillId: string;
                projectId: string;
            })[];
            owner: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
            _count: {
                members: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            slug: string;
            title: string;
            summary: string | null;
            description: string;
            coverImageUrl: string | null;
            repositoryUrl: string | null;
            status: string;
            visibility: string;
            ownerId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
