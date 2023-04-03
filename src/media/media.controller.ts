import { Controller, HttpCode, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseInterceptors(FileInterceptor('media'))
  @HttpCode(200)
  @Post('')
  @Auth()
  async uploadMediaFile(
    @UploadedFile() mediaFile: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.mediaService.saveMedia(mediaFile, folder);
  }
}
