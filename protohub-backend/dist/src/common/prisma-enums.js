"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIRole = exports.ActivityAction = exports.NotificationType = exports.SkillProficiency = exports.TaskPriority = exports.MentorshipStatus = exports.JoinRequestStatus = exports.MembershipStatus = exports.ProjectMemberRole = exports.ProjectVisibility = exports.ProjectStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "STUDENT";
    UserRole["TEACHER"] = "TEACHER";
    UserRole["PROFESSIONAL"] = "PROFESSIONAL";
    UserRole["HOBBYIST"] = "HOBBYIST";
    UserRole["MENTOR"] = "MENTOR";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["DRAFT"] = "DRAFT";
    ProjectStatus["ACTIVE"] = "ACTIVE";
    ProjectStatus["COMPLETED"] = "COMPLETED";
    ProjectStatus["ARCHIVED"] = "ARCHIVED";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ProjectVisibility;
(function (ProjectVisibility) {
    ProjectVisibility["PUBLIC"] = "PUBLIC";
    ProjectVisibility["PRIVATE"] = "PRIVATE";
})(ProjectVisibility || (exports.ProjectVisibility = ProjectVisibility = {}));
var ProjectMemberRole;
(function (ProjectMemberRole) {
    ProjectMemberRole["OWNER"] = "OWNER";
    ProjectMemberRole["MAINTAINER"] = "MAINTAINER";
    ProjectMemberRole["CONTRIBUTOR"] = "CONTRIBUTOR";
})(ProjectMemberRole || (exports.ProjectMemberRole = ProjectMemberRole = {}));
var MembershipStatus;
(function (MembershipStatus) {
    MembershipStatus["ACTIVE"] = "ACTIVE";
    MembershipStatus["LEFT"] = "LEFT";
    MembershipStatus["REMOVED"] = "REMOVED";
})(MembershipStatus || (exports.MembershipStatus = MembershipStatus = {}));
var JoinRequestStatus;
(function (JoinRequestStatus) {
    JoinRequestStatus["PENDING"] = "PENDING";
    JoinRequestStatus["ACCEPTED"] = "ACCEPTED";
    JoinRequestStatus["REJECTED"] = "REJECTED";
    JoinRequestStatus["WITHDRAWN"] = "WITHDRAWN";
})(JoinRequestStatus || (exports.JoinRequestStatus = JoinRequestStatus = {}));
var MentorshipStatus;
(function (MentorshipStatus) {
    MentorshipStatus["PENDING"] = "PENDING";
    MentorshipStatus["ACCEPTED"] = "ACCEPTED";
    MentorshipStatus["REJECTED"] = "REJECTED";
    MentorshipStatus["CANCELLED"] = "CANCELLED";
    MentorshipStatus["COMPLETED"] = "COMPLETED";
})(MentorshipStatus || (exports.MentorshipStatus = MentorshipStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "LOW";
    TaskPriority["MEDIUM"] = "MEDIUM";
    TaskPriority["HIGH"] = "HIGH";
    TaskPriority["URGENT"] = "URGENT";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var SkillProficiency;
(function (SkillProficiency) {
    SkillProficiency["BEGINNER"] = "BEGINNER";
    SkillProficiency["INTERMEDIATE"] = "INTERMEDIATE";
    SkillProficiency["ADVANCED"] = "ADVANCED";
    SkillProficiency["EXPERT"] = "EXPERT";
})(SkillProficiency || (exports.SkillProficiency = SkillProficiency = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["PROJECT_INVITE"] = "PROJECT_INVITE";
    NotificationType["JOIN_REQUEST"] = "JOIN_REQUEST";
    NotificationType["JOIN_REQUEST_ACCEPTED"] = "JOIN_REQUEST_ACCEPTED";
    NotificationType["JOIN_REQUEST_REJECTED"] = "JOIN_REQUEST_REJECTED";
    NotificationType["MENTORSHIP_REQUEST"] = "MENTORSHIP_REQUEST";
    NotificationType["MENTORSHIP_ACCEPTED"] = "MENTORSHIP_ACCEPTED";
    NotificationType["MENTORSHIP_REJECTED"] = "MENTORSHIP_REJECTED";
    NotificationType["TASK_ASSIGNED"] = "TASK_ASSIGNED";
    NotificationType["TASK_COMMENT"] = "TASK_COMMENT";
    NotificationType["CHAT_MESSAGE"] = "CHAT_MESSAGE";
    NotificationType["MENTION"] = "MENTION";
    NotificationType["SYSTEM"] = "SYSTEM";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var ActivityAction;
(function (ActivityAction) {
    ActivityAction["PROJECT_CREATED"] = "PROJECT_CREATED";
    ActivityAction["PROJECT_UPDATED"] = "PROJECT_UPDATED";
    ActivityAction["MEMBER_JOINED"] = "MEMBER_JOINED";
    ActivityAction["MEMBER_LEFT"] = "MEMBER_LEFT";
    ActivityAction["MEMBER_REMOVED"] = "MEMBER_REMOVED";
    ActivityAction["TASK_CREATED"] = "TASK_CREATED";
    ActivityAction["TASK_UPDATED"] = "TASK_UPDATED";
    ActivityAction["TASK_COMPLETED"] = "TASK_COMPLETED";
    ActivityAction["TASK_ASSIGNED"] = "TASK_ASSIGNED";
    ActivityAction["COMMENT_ADDED"] = "COMMENT_ADDED";
    ActivityAction["FILE_UPLOADED"] = "FILE_UPLOADED";
    ActivityAction["MENTORSHIP_ACCEPTED"] = "MENTORSHIP_ACCEPTED";
})(ActivityAction || (exports.ActivityAction = ActivityAction = {}));
var AIRole;
(function (AIRole) {
    AIRole["USER"] = "USER";
    AIRole["ASSISTANT"] = "ASSISTANT";
    AIRole["SYSTEM"] = "SYSTEM";
})(AIRole || (exports.AIRole = AIRole = {}));
//# sourceMappingURL=prisma-enums.js.map