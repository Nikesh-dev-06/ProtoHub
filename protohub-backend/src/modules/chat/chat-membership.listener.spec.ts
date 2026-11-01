import { Test } from '@nestjs/testing';
import { ChatMembershipListener } from './chat-membership.listener';
import { ChatRepository } from './chat.repository';

describe('ChatMembershipListener', () => {
  let listener: ChatMembershipListener;
  let repo: jest.Mocked<ChatRepository>;

  const PROJECT_ID = 'project-1';
  const USER_ID = 'user-1';
  const CHANNEL_ID = 'channel-1';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ChatMembershipListener,
        {
          provide: ChatRepository,
          useValue: {
            findChannelByProject: jest.fn(),
            addChannelMember: jest.fn(),
            removeChannelMember: jest.fn(),
          },
        },
      ],
    }).compile();

    listener = moduleRef.get(ChatMembershipListener);
    repo = moduleRef.get(ChatRepository);
  });

  it('adds the user to the channel when they join the project', async () => {
    repo.findChannelByProject.mockResolvedValue({ id: CHANNEL_ID } as any);

    await listener.handleMemberJoined({ projectId: PROJECT_ID, userId: USER_ID });

    expect(repo.addChannelMember).toHaveBeenCalledWith(CHANNEL_ID, USER_ID);
  });

  it('removes the user from the channel when they leave the project', async () => {
    repo.findChannelByProject.mockResolvedValue({ id: CHANNEL_ID } as any);

    await listener.handleMemberRemoved({ projectId: PROJECT_ID, userId: USER_ID });

    expect(repo.removeChannelMember).toHaveBeenCalledWith(CHANNEL_ID, USER_ID);
  });

  it('does not throw when the project somehow has no channel yet', async () => {
    repo.findChannelByProject.mockResolvedValue(null);

    await expect(listener.handleMemberJoined({ projectId: PROJECT_ID, userId: USER_ID })).resolves.toBeUndefined();
    expect(repo.addChannelMember).not.toHaveBeenCalled();
  });
});
