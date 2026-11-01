import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UploadsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(params: {
    uploaderId: string;
    projectId?: string;
    taskId?: string;
    url: string;
    publicId: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
  }) {
    return this.prisma.attachment.create({ data: params });
  }
}
