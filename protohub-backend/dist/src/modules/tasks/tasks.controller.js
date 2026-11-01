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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const tasks_service_1 = require("./tasks.service");
const create_column_dto_1 = require("./dto/create-column.dto");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const move_task_dto_1 = require("./dto/move-task.dto");
const create_comment_dto_1 = require("./dto/create-comment.dto");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    getBoard(projectId, user) {
        return this.tasksService.getBoard(projectId, user.id);
    }
    createColumn(projectId, dto, user) {
        return this.tasksService.createColumn(projectId, dto, user.id);
    }
    renameColumn(projectId, columnId, dto, user) {
        return this.tasksService.renameColumn(projectId, columnId, dto, user.id);
    }
    deleteColumn(projectId, columnId, user) {
        return this.tasksService.deleteColumn(projectId, columnId, user.id);
    }
    createTask(projectId, dto, user) {
        return this.tasksService.createTask(projectId, dto, user.id);
    }
    getTask(projectId, taskId, user) {
        return this.tasksService.getTask(projectId, taskId, user.id);
    }
    updateTask(projectId, taskId, dto, user) {
        return this.tasksService.updateTask(projectId, taskId, dto, user.id);
    }
    moveTask(projectId, taskId, dto, user) {
        return this.tasksService.moveTask(projectId, taskId, dto, user.id);
    }
    deleteTask(projectId, taskId, user) {
        return this.tasksService.deleteTask(projectId, taskId, user.id);
    }
    addComment(projectId, taskId, dto, user) {
        return this.tasksService.addComment(projectId, taskId, dto, user.id);
    }
    listComments(projectId, taskId, user) {
        return this.tasksService.listComments(projectId, taskId, user.id);
    }
    deleteComment(projectId, commentId, user) {
        return this.tasksService.deleteComment(projectId, commentId, user.id);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Get)('board'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "getBoard", null);
__decorate([
    (0, common_1.Post)('columns'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_column_dto_1.CreateColumnDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "createColumn", null);
__decorate([
    (0, common_1.Patch)('columns/:columnId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('columnId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_column_dto_1.CreateColumnDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "renameColumn", null);
__decorate([
    (0, common_1.Delete)('columns/:columnId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('columnId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "deleteColumn", null);
__decorate([
    (0, common_1.Post)('tasks'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "createTask", null);
__decorate([
    (0, common_1.Get)('tasks/:taskId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "getTask", null);
__decorate([
    (0, common_1.Patch)('tasks/:taskId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_task_dto_1.UpdateTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Patch)('tasks/:taskId/move'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, move_task_dto_1.MoveTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "moveTask", null);
__decorate([
    (0, common_1.Delete)('tasks/:taskId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "deleteTask", null);
__decorate([
    (0, common_1.Post)('tasks/:taskId/comments'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_comment_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)('tasks/:taskId/comments'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "listComments", null);
__decorate([
    (0, common_1.Delete)('comments/:commentId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "deleteComment", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)('projects/:projectId'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map