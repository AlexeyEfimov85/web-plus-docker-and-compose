import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWishList(
    @AuthUser() user: User,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.create(
      user.id,
      createWishlistDto,
    );
    return wishlist;
  }

  @Get('/:id')
  async getWishlistById(@Param('id') id: number) {
    return this.wishlistsService.findWhishlistsByOptions({
      where: { id: id },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  @Get('')
  async getWishlists() {
    return this.wishlistsService.findWhishlistsByOptions({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updatewishlistById(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUser() user: User,
  ) {
    return this.wishlistsService.updateWishlist(user, updateWishlistDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deletewishlistById(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishlistsService.deleteWishlist(user, id);
  }
}
