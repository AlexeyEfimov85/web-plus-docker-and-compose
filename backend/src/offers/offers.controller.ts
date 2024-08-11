import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/common/decorators/user.decorator';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOffer(
    @AuthUser() user: User,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return await this.offersService.createOffer(createOfferDto, user);
  }

  @Get()
  async findOffers() {
    return await this.offersService.findOffers({
      relations: {
        user: true,
        item: true,
      },
    });
  }
  @Get('/:id')
  async findOffersById(@Param('id') id: number) {
    return this.offersService.findOffers({
      where: { id: id },
      relations: {
        user: true,
        item: true,
      },
    });
  }
}
