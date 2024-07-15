import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signUp(user: SignInDto) {
    const newUser = await this.prisma.user.create({
      data: user,
    });

    const token = await this.jwtService.signAsync(
      {},
      {
        jwtid: uuidv4(),
        subject: newUser.id,
      },
    );

    return {
      user: newUser,
      token,
    };
  }

  async signIn(credentials: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const token = await this.jwtService.signAsync(
      {},
      {
        jwtid: uuidv4(),
        subject: user.id,
      },
    );

    return {
      user,
      token,
    };
  }

  async revokeToken(jti: string) {
    await this.prisma.revokedToken.create({
      data: {
        jti,
      },
    });

    return true;
  }

  async getById(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }
}
