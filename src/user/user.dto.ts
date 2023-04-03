import { IsEmail, IsString } from 'class-validator';
import { JoinColumn } from 'typeorm';

export class UserDto {
  @IsEmail()
  email: string;

  password?: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @JoinColumn({ name: 'avatar_path' })
  avatarPath: string;
}
