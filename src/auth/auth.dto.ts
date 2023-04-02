import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'Неверный формат Email' })
  email: string;

  @MinLength(6, { message: 'Не менее 6 символов' })
  @IsString()
  password: string;
}
