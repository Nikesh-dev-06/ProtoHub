import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicUser } from '../users/users.service';
import { UploadsService } from './uploads.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get('signature')
  getSignature(@Query('folder') folder: string | undefined, @CurrentUser() _user: PublicUser) {
    return this.uploadsService.createUploadSignature(folder || 'protohub/general');
  }

  @Post()
  recordAttachment(@Body() dto: CreateAttachmentDto, @CurrentUser() user: PublicUser) {
    return this.uploadsService.recordAttachment(user.id, dto);
  }
}
