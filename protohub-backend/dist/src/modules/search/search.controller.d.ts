import { SearchService } from './search.service';
import { SearchQueryDto } from './search-query.dto';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(query: SearchQueryDto): Promise<{
        projects: ({
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
        })[] | never[];
        people: {
            id: string;
            name: string;
            headline: string | null;
            avatarUrl: string | null;
            role: string;
        }[] | never[];
    }>;
}
