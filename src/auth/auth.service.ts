import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  returnUserFields(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
    };
  }

  async issueAccessToken(userId: number) {
    const data = {
      id: userId,
    };

    return await this.jwtService.signAsync(data, {
      expiresIn: '31d',
    });
  }

  async validateUser(dto: AuthDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return user;
  }

  async register(dto: AuthDto) {
    const existence = await this.userRepository.findOneBy({ email: dto.email });

    if (existence) {
      throw new BadRequestException('Email занят');
    }

    const salt = await genSalt(10);

    const newUser = this.userRepository.create({
      email: dto.email,
      password: await hash(dto.password, salt),
    });

    const user = await this.userRepository.save(newUser);

    return {
      user: this.returnUserFields(user),
      accessToken: await this.issueAccessToken(user.id),
    };
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    return {
      user: this.returnUserFields(user),
      accessToken: await this.issueAccessToken(user.id),
    };
  }
}
