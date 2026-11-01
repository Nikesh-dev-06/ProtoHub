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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const prisma_enums_1 = require("../../common/prisma-enums");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const users_service_1 = require("../users/users.service");
const projects_service_1 = require("../projects/projects.service");
const set_user_active_dto_1 = require("./set-user-active.dto");
let AdminController = class AdminController {
    constructor(usersService, projectsService) {
        this.usersService = usersService;
        this.projectsService = projectsService;
    }
    listUsers(page = '1', limit = '20') {
        return this.usersService.listAll(Number(page), Number(limit));
    }
    setUserActive(id, dto) {
        return this.usersService.setActive(id, dto.isActive);
    }
    listProjects(page = '1', limit = '20') {
        return this.projectsService.findAll({ page: Number(page), limit: Number(limit) });
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, set_user_active_dto_1.SetUserActiveDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "setUserActive", null);
__decorate([
    (0, common_1.Get)('projects'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listProjects", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, roles_decorator_1.Roles)(prisma_enums_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        projects_service_1.ProjectsService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map