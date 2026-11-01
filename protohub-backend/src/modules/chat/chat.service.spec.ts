import { Test } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';

describe('ChatService', () => {
  let service: ChatService;
  let repo: jest.Mocked<ChatRepository>;

  const PROJECT_ID = 'project-1';
  const CHANNEL_ID = 'channel-1';
  const USER_ID = 'user-1';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: ChatRepository,
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

    service = moduleRef.get(ChatService);
    repo = moduleRef.get(ChatRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('assertChannelAccess', () => {
    it('throws NotFoundException when the project has no channel', async () => {
      repo.findChannelByProject.mockResolvedValue(null);
      await expect(service.assertChannelAccess(PROJECT_ID, USER_ID)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws ForbiddenException when the user is not a channel member', async () => {
      repo.findChannelByProject.mockResolvedValue({ id: CHANNEL_ID } as any);
      repo.findChannelMember.mockResolvedValue(null);
      await expect(service.assertChannelAccess(PROJECT_ID, USER_ID)).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('returns the channel when the user is a member', async () => {
      repo.findChannelByProject.mockResolvedValue({ id: CHANNEL_ID } as any);
      repo.findChannelMember.mockResolvedValue({ id: 'membership-1' } as any);
      await expect(service.assertChannelAccess(PROJECT_ID, USER_ID)).resolves.toEqual({ id: CHANNEL_ID });
    });
  });

  describe('editMessage / deleteMessage', () => {
    beforeEach(() => {
      repo.findChannelByProject.mockResolvedValue({ id: CHANNEL_ID } as any);
      repo.findChannelMember.mockResolvedValue({ id: 'membership-1' } as any);
    });

    it('allows the sender to edit their own message', async () => {
      repo.findMessageById.mockResolvedValue({ id: 'msg-1', senderId: USER_ID } as any);
      repo.editMessage.mockResolvedValue({ id: 'msg-1', content: 'edited' } as any);

      await service.editMessage(PROJECT_ID, 'msg-1', USER_ID, { content: 'edited' });
      expect(repo.editMessage).toHaveBeenCalledWith('msg-1', 'edited');
    });

    it('blocks editing someone else\'s message', async () => {
      repo.findMessageById.mockResolvedValue({ id: 'msg-1', senderId: 'someone-else' } as any);

      await expect(service.editMessage(PROJECT_ID, 'msg-1', USER_ID, { content: 'edited' })).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(repo.editMessage).not.toHaveBeenCalled();
    });

    it('blocks deleting someone else\'s message', async () => {
      repo.findMessageById.mockResolvedValue({ id: 'msg-1', senderId: 'someone-else' } as any);

      await expect(service.deleteMessage(PROJECT_ID, 'msg-1', USER_ID)).rejects.toBeInstanceOf(ForbiddenException);
      expect(repo.softDeleteMessage).not.toHaveBeenCalled();
    });
  });
});
