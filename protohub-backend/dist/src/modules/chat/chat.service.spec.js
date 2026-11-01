"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const chat_repository_1 = require("./chat.repository");
describe('ChatService', () => {
    let service;
    let repo;
    const PROJECT_ID = 'project-1';
    const CHANNEL_ID = 'channel-1';
    const USER_ID = 'user-1';
    beforeEach(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [
                chat_service_1.ChatService,
                {
                    provide: chat_repository_1.ChatRepository,
                    useValue: {
                        findChannelByProject: jest.fn(),
                        findChannelMember: jest.fn(),
                        listMessages: jest.fn(),
                        createMessage: jest.fn(),
                        findMessageById: jest.fn(),
                        editMessage: jest.fn(),
                        softDeleteMessage: jest.fn(),
                        updateLastRead: jest.fn(),
                    },
                },
            ],
        }).compile();
        service = moduleRef.get(chat_service_1.ChatService);
        repo = moduleRef.get(chat_repository_1.ChatRepository);
    });
    afterEach(() => jest.clearAllMocks());
    describe('assertChannelAccess', () => {
        it('throws NotFoundException when the project has no channel', async () => {
            repo.findChannelByProject.mockResolvedValue(null);
            await expect(service.assertChannelAccess(PROJECT_ID, USER_ID)).rejects.toBeInstanceOf(common_1.NotFoundException);
        });
        it('throws ForbiddenException when the user is not a channel member', async () => {
            repo.findChannelByProject.mockResolvedValue({ id: CHANNEL_ID });
            repo.findChannelMember.mockResolvedValue(null);
            await expect(service.assertChannelAccess(PROJECT_ID, USER_ID)).rejects.toBeInstanceOf(common_1.ForbiddenException);
        });
        it('returns the channel when the user is a member', async () => {
            repo.findChannelByProject.mockResolvedValue({ id: CHANNEL_ID });
            repo.findChannelMember.mockResolvedValue({ id: 'membership-1' });
            await expect(service.assertChannelAccess(PROJECT_ID, USER_ID)).resolves.toEqual({ id: CHANNEL_ID });
        });
    });
    describe('editMessage / deleteMessage', () => {
        beforeEach(() => {
            repo.findChannelByProject.mockResolvedValue({ id: CHANNEL_ID });
            repo.findChannelMember.mockResolvedValue({ id: 'membership-1' });
        });
        it('allows the sender to edit their own message', async () => {
            repo.findMessageById.mockResolvedValue({ id: 'msg-1', senderId: USER_ID });
            repo.editMessage.mockResolvedValue({ id: 'msg-1', content: 'edited' });
            await service.editMessage(PROJECT_ID, 'msg-1', USER_ID, { content: 'edited' });
            expect(repo.editMessage).toHaveBeenCalledWith('msg-1', 'edited');
        });
        it('blocks editing someone else\'s message', async () => {
            repo.findMessageById.mockResolvedValue({ id: 'msg-1', senderId: 'someone-else' });
            await expect(service.editMessage(PROJECT_ID, 'msg-1', USER_ID, { content: 'edited' })).rejects.toBeInstanceOf(common_1.ForbiddenException);
            expect(repo.editMessage).not.toHaveBeenCalled();
        });
        it('blocks deleting someone else\'s message', async () => {
            repo.findMessageById.mockResolvedValue({ id: 'msg-1', senderId: 'someone-else' });
            await expect(service.deleteMessage(PROJECT_ID, 'msg-1', USER_ID)).rejects.toBeInstanceOf(common_1.ForbiddenException);
            expect(repo.softDeleteMessage).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=chat.service.spec.js.map