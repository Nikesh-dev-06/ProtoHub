import { ChatRepository } from './chat.repository';
interface ProjectMembershipEvent {
    projectId: string;
    userId: string;
}
export declare class ChatMembershipListener {
    private readonly chatRepository;
    private readonly logger;
    constructor(chatRepository: ChatRepository);
    handleMemberJoined({ projectId, userId }: ProjectMembershipEvent): Promise<void>;
    handleMemberRemoved({ projectId, userId }: ProjectMembershipEvent): Promise<void>;
}
export {};
