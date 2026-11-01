"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("../projects/projects.service");
const users_service_1 = require("../users/users.service");
let SearchService = class SearchService {
    constructor(projectsService, usersService) {
        this.projectsService = projectsService;
        this.usersService = usersService;
    }
    async search(query, type) {
        const [projects, people] = await Promise.all([
            type === 'people' ? Promise.resolve({ data: [], meta: null }) : this.projectsService.findAll({ search: query, page: 1, limit: 10 }),
            type === 'projects' ? Promise.resolve([]) : this.usersService.searchUsers(query, 10),
        ]);
        return {
            projects: projects.data,
            people,
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService,
        users_service_1.UsersService])
], SearchService);
//# sourceMappingURL=search.service.js.map