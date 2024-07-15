import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RemovePasswordInterceptor } from 'src/interceptors/remove-password/remove-password.interceptor';
import { SignInDto } from './dto/sign-in.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/sign-up')
  async signUp(
    @Body() newUser: SignInDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const { user, token }: { user: Partial<UserDto>; token: string } =
        await this.userService.signUp(newUser);

      delete user.password;

      res.cookie('jwt', token, { httpOnly: true });

      res.status(201).send({ user: user });
    } catch (err: unknown) {
      throw new InternalServerErrorException(err);
    }
  }

  @Post('auth/sign-in')
  async signIn(@Body() credentials: SignInDto, @Res() res: Response) {
    try {
      const { user, token }: { user: Partial<UserDto>; token: string } =
        await this.userService.signIn(credentials);

      delete user.password;

      res.cookie('jwt', token, { httpOnly: true });

      res.send({ user: user });
    } catch (err: unknown) {
      throw new InternalServerErrorException(err);
    }
  }

  @UseGuards(AuthGuard)
  @Post('auth/revoke-token')
  async revokeToken(@Req() req: Request): Promise<{ revoked: boolean }> {
    return { revoked: await this.userService.revokeToken(req.user.jti) };
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(RemovePasswordInterceptor)
  @Get()
  async getMe(@Req() req: Request): Promise<{ user: UserDto }> {
    try {
      return { user: await this.userService.getById(req.user.sub) };
    } catch (err: unknown) {
      throw new InternalServerErrorException(err);
    }
  }
}
