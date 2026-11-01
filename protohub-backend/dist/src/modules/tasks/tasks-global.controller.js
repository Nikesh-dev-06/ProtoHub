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
exports.TasksGlobalController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const tasks_service_1 = require("./tasks.service");
let TasksGlobalController = class TasksGlobalController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    findUserTasks(user) {
        return this.tasksService.findUserTasks(user.id);
    }
    findAllUserTasksForPlanner(user) {
        return this.tasksService.findAllUserTasksForPlanner(user.id);
    }
};
exports.TasksGlobalController = TasksGlobalController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TasksGlobalController.prototype, "findUserTasks", null);
__decorate([
    (0, common_1.Get)('planner'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TasksGlobalController.prototype, "findAllUserTasksForPlanner", null);
exports.TasksGlobalController = TasksGlobalController = __decorate([
    (0, common_1.Controller)('users/me/tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksGlobalController);
//# sourceMappingURL=tasks-global.controller.js.map