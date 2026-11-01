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
exports.MentorshipController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const mentorship_service_1 = require("./mentorship.service");
const create_mentorship_request_dto_1 = require("./dto/create-mentorship-request.dto");
const respond_mentorship_request_dto_1 = require("./dto/respond-mentorship-request.dto");
let MentorshipController = class MentorshipController {
    constructor(mentorshipService) {
        this.mentorshipService = mentorshipService;
    }
    request(dto, user) {
        return this.mentorshipService.request(user.id, dto);
    }
    listSent(user) {
        return this.mentorshipService.listSent(user.id);
    }
    listReceived(user) {
        return this.mentorshipService.listReceived(user.id);
    }
    respond(id, dto, user) {
        return this.mentorshipService.respond(id, user.id, dto);
    }
    cancel(id, user) {
        return this.mentorshipService.cancel(id, user.id);
    }
};
exports.MentorshipController = MentorshipController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mentorship_request_dto_1.CreateMentorshipRequestDto, Object]),
    __metadata("design:returntype", void 0)
], MentorshipController.prototype, "request", null);
__decorate([
    (0, common_1.Get)('sent'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MentorshipController.prototype, "listSent", null);
__decorate([
    (0, common_1.Get)('received'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MentorshipController.prototype, "listReceived", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, respond_mentorship_request_dto_1.RespondMentorshipRequestDto, Object]),
    __metadata("design:returntype", void 0)
], MentorshipController.prototype, "respond", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MentorshipController.prototype, "cancel", null);
exports.MentorshipController = MentorshipController = __decorate([
    (0, common_1.Controller)('mentorship-requests'),
    __metadata("design:paramtypes", [mentorship_service_1.MentorshipService])
], MentorshipController);
//# sourceMappingURL=mentorship.controller.js.map