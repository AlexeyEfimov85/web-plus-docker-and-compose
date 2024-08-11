import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async createWish(
    @AuthUser() user: User,
    @Body() createWishDto: CreateWishDto,
  ) {
    const wish = await this.wishesService.create(user.id, createWishDto);
    return wish;
  }

  @Get('last')
  async getLastWishes() {
    return this.wishesService.findWishesByOptions({
      order: {
        createdAt: 'ASC',
      },
      take: 40,
    });
  }

  @Get('top')
  async getTopWishes() {
    return this.wishesService.findWishesByOptions({
      order: {
        raised: 'ASC',
      },
      take: 20,
    });
  }

  @Get('/:id')
  async getWishById(@Param('id') id: number) {
    return this.wishesService.findWishesByOptions({
      where: { id: id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateWish(
    @Param() id: { id: number },
    @AuthUser() user: User,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateWish(user, updateWishDto, id.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteWish(@Param() id: { id: number }, @AuthUser() user: User) {
    return this.wishesService.deleteWish(user, id.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/copy')
  async copyWish(@AuthUser() user: User, @Param() id: { id: number }) {
    return this.wishesService.copyWish(user, id.id);
  }
}
