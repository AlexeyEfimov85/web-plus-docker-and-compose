import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { FindManyOptions, In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}
  async create(
    userId: number,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const owner = await this.usersService.findById(userId);
    const items = await this.wishesService.findWishesByOptions({
      where: { id: In(createWishlistDto.itemsId) },
      relations: {
        owner: true,
        offers: true,
      },
    });
    return this.wishlistsRepository.save({
      ...createWishlistDto,
      owner,
      items,
    });
  }

  async findWhishlistsByOptions(
    option: FindManyOptions<Wishlist>,
  ): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find(option);
  }

  async updateWishlist(
    user: User,
    updateWishlistDto: UpdateWishlistDto,
    wishlistId: number,
  ) {
    const updatedWishlist = await this.wishlistsRepository.findOne({
      where: { id: wishlistId },
      relations: ['owner'],
    });
    if (updatedWishlist.owner.id === user.id) {
      return this.wishlistsRepository.save({
        ...updatedWishlist,
        ...updateWishlistDto,
      });
    }
  }

  async deleteWishlist(user: User, wishlistId: number) {
    const deletedWishlist = await this.wishlistsRepository.findOne({
      where: { id: wishlistId },
      relations: ['owner'],
    });
    if (deletedWishlist.owner.id === user.id) {
      return await this.wishlistsRepository.delete(deletedWishlist.id);
    }
  }
}
