"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const chat_membership_listener_1 = require("./chat-membership.listener");
const chat_repository_1 = require("./chat.repository");
describe('ChatMembershipListener', () => {
    let listener;
    let repo;
    const PROJECT_ID = 'project-1';
    const USER_ID = 'user-1';
    const CHANNEL_ID = 'channel-1';
    beforeEach(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [
                chat_membership_listener_1.ChatMembershipListener,
                {
                    provide: chat_repository_1.ChatRepository,
                    useValue: {
                        findChannelByProject: jest.fn(),
                        addChannelMember: jest.fn(),
                        removeChannelMember: jest.fn(),
                    },
                },
            ],
        }).compile();
        listener = moduleRef.get(chat_membership_listener_1.ChatMembershipListener);
        repo = moduleRef.get(chat_repository_1.ChatRepository);
    });
    it('adds the user to the channel when they join the project', async () => {
        repo.findChannelByProject.mockResolvedValue({ id: CHANNEL_ID });
        await listener.handleMemberJoined({ projectId: PROJECT_ID, userId: USER_ID });
        expect(repo.addChannelMember).toHaveBeenCalledWith(CHANNEL_ID, USER_ID);
    });
    it('removes the user from the channel when they leave the project', async () => {
        repo.findChannelByProject.mockResolvedValue({ id: CHANNEL_ID });
        await listener.handleMemberRemoved({ projectId: PROJECT_ID, userId: USER_ID });
        expect(repo.removeChannelMember).toHaveBeenCalledWith(CHANNEL_ID, USER_ID);
    });
    it('does not throw when the project somehow has no channel yet', async () => {
        repo.findChannelByProject.mockResolvedValue(null);
        await expect(listener.handleMemberJoined({ projectId: PROJECT_ID, userId: USER_ID })).resolves.toBeUndefined();
        expect(repo.addChannelMember).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=chat-membership.listener.spec.js.map