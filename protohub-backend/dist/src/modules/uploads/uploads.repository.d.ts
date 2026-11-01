import { PrismaService } from '../../prisma/prisma.service';
export declare class UploadsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(params: {
        uploaderId: string;
        projectId?: string;
        taskId?: string;
        url: string;
        publicId: string;
        fileName: string;
        mimeType: string;
        fileSize: number;
    }): import(".prisma/client").Prisma.Prisma__AttachmentClient<{
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
