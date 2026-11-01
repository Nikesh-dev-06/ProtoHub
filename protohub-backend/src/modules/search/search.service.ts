import { Injectable } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';

/**
 * MVP implementation uses ILIKE via Prisma's `contains` (see
 * ProjectsRepository.findMany / UsersRepository.searchUsers). This is fine
 * at MVP scale but doesn't use an index — the flagged upgrade path from
 * Sprint 1 is a Postgres `tsvector` column + GIN index on
 * Project.title/description once query latency or corpus size demands it.
 */
@Injectable()
export class SearchService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}

  async search(query: string, type: 'all' | 'projects' | 'people') {
    const [projects, people] = await Promise.all([
      type === 'people' ? Promise.resolve({ data: [], meta: null }) : this.projectsService.findAll({ search: query, page: 1, limit: 10 }),
      type === 'projects' ? Promise.resolve([]) : this.usersService.searchUsers(query, 10),
    ]);

    return {
      projects: projects.data,
      people,
    };
  }
}
