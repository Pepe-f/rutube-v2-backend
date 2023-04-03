import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoEntity } from './video.entity';
import { FindOptionsWhereProperty, ILike, MoreThan, Repository } from 'typeorm';
import { VideoDto } from './video.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity) private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  async byId(id: number, isPublic = false) {
    const video = await this.videoRepository.findOne({
      where: isPublic ? { id, isPublic } : { id },
      relations: { user: true, comments: { user: true } },
      select: {
        user: {
          id: true,
          avatarPath: true,
          name: true,
          isVerified: true,
          subscribersCount: true,
          subscriptions: true,
        },
        comments: {
          id: true,
          message: true,
          user: {
            id: true,
            name: true,
            avatarPath: true,
            isVerified: true,
            subscribersCount: true,
          },
        },
      },
    });

    if (!video) {
      throw new NotFoundException('Видео не найдено');
    }

    return video;
  }

  async getAll(searchTerm?: string) {
    let options: FindOptionsWhereProperty<VideoEntity> = {};

    if (searchTerm) {
      options = { name: ILike(`%${searchTerm}%`) };
    }

    return this.videoRepository.find({
      where: { ...options, isPublic: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updateVideo(id: number, dto: VideoDto) {
    const video = await this.byId(id);

    return this.videoRepository.save({ ...video, ...dto });
  }

  async getMostPopularVideos() {
    return this.videoRepository.find({
      where: { views: MoreThan(0) },
      relations: { user: true },
      select: { user: { id: true, name: true, avatarPath: true, isVerified: true } },
      order: { views: -1 },
    });
  }

  async createVideo(userId: number) {
    const defaultValues = {
      name: '',
      videoPath: '',
      thumbnailPath: '',
      description: '',
      user: { id: userId },
    };

    const newVideo = await this.videoRepository.create(defaultValues);
    const video = await this.videoRepository.save(newVideo);

    return video.id;
  }

  async deleteVideo(id: number) {
    return this.videoRepository.delete({ id });
  }

  async updateReaction(id: number) {
    const video = await this.videoRepository.findOneBy({ id });
    video.likes += 1;

    return this.videoRepository.save(video);
  }

  async updateViews(id: number) {
    const video = await this.videoRepository.findOneBy({ id });
    video.views += 1;

    return this.videoRepository.save(video);
  }
}
