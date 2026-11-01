import { ConfigService } from '@nestjs/config';
import { UploadsRepository } from './uploads.repository';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
export declare class UploadsService {
    private readonly uploadsRepository;
    private readonly configService;
    constructor(uploadsRepository: UploadsRepository, configService: ConfigService);
    createUploadSignature(folder: string): {
        signature: string;
        timestamp: number;
        apiKey: string | undefined;
        cloudName: string | undefined;
        folder: string;
    };
    recordAttachment(uploaderId: string, dto: CreateAttachmentDto): import(".prisma/client").Prisma.Prisma__AttachmentClient<{
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
