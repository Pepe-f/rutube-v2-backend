import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';
import { VideoDto } from './video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('by-id/:id')
  async getVideoById(@Param('id') id: string) {
    return this.videoService.byId(+id);
  }

  @Get('all')
  async getAllVideos(@Query('searchTerm') searchTerm?: string) {
    return this.videoService.getAll(searchTerm);
  }

  @Get('get-private/:id')
  @Auth()
  async getPrivateVideo(@Param('id') id: string) {
    return this.videoService.byId(+id);
  }

  @Get('most-popular')
  async getMostPopularVideos() {
    return this.videoService.getMostPopularVideos();
  }

  @HttpCode(200)
  @Post('')
  @Auth()
  async createVideo(@CurrentUser('id') id: string) {
    return this.videoService.createVideo(+id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async updateVideo(@Param('id') id: string, @Body() dto: VideoDto) {
    return this.videoService.updateVideo(+id, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async deleteVideo(@Param('id') id: string) {
    return this.videoService.deleteVideo(+id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update-views/:videoId')
  async updateViews(@Param('videoId') videoId: string) {
    return this.videoService.updateViews(+videoId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update-likes/:videoId')
  @Auth()
  async updateLikes(@Param('videoId') videoId: string) {
    return this.videoService.updateReaction(+videoId);
  }
}
