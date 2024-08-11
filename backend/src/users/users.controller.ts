import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findOwn(@AuthUser() user: User): Promise<User> {
    return this.usersService.findOne({
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  async updateOne(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { id } = user;
    return this.usersService.update(id, updateUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/me/wishes')
  async FindMyWishes(@AuthUser() user: User) {
    return await this.wishesService.findWishById(user.id);
  }

  @Get('/:username')
  async findUser(@Param('username') username: string): Promise<User> {
    return this.usersService.findOne({
      where: { username: username },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Get('/:username/wishes')
  async findUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return await this.wishesService.findWishByUserName(username);
  }

  @Post('/find')
  async findMany(@Body() query): Promise<User> {
    return this.usersService.findOne({
      where: [{ email: query.query }, { username: query.query }],
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
