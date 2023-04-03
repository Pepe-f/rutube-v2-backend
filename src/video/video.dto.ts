import { IsString } from 'class-validator';
import { JoinColumn } from 'typeorm';

export class VideoDto {
  @IsString()
  name: string;

  isPublic?: boolean;

  @IsString()
  description: string;

  @IsString()
  @JoinColumn({ name: 'video_path' })
  videoPath: string;

  @IsString()
  @JoinColumn({ name: 'thumbnail_path' })
  thumbnailPath: string;
}
