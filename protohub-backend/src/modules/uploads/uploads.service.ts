import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { UploadsRepository } from './uploads.repository';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadsRepository: UploadsRepository,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Cloudinary's signed-upload scheme: we sign a small set of params with
   * our API secret (never sent to the client); the client attaches that
   * signature to a direct upload request to Cloudinary. The file itself
   * never touches our server, so upload size/throughput isn't our problem.
   */
  createUploadSignature(folder: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET')!;

    // Cloudinary requires params to be sorted alphabetically and joined as
    // key=value pairs before signing — this order is part of their spec,
    // not a stylistic choice.
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + apiSecret)
      .digest('hex');

    return {
      signature,
      timestamp,
      apiKey: this.configService.get<string>('CLOUDINARY_API_KEY'),
      cloudName: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      folder,
    };
  }

  recordAttachment(uploaderId: string, dto: CreateAttachmentDto) {
    return this.uploadsRepository.create({ uploaderId, ...dto });
  }
}
