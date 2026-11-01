import { PublicUser } from '../users/users.service';
import { UploadsService } from './uploads.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    getSignature(folder: string | undefined, _user: PublicUser): {
        signature: string;
        timestamp: number;
        apiKey: string | undefined;
        cloudName: string | undefined;
        folder: string;
    };
    recordAttachment(dto: CreateAttachmentDto, user: PublicUser): import(".prisma/client").Prisma.Prisma__AttachmentClient<{
        id: string;
        createdAt: Date;
        projectId: string | null;
        taskId: string | null;
        url: string;
        publicId: string;
        fileName: string;
        mimeType: string;
        fileSize: number;
        uploaderId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
