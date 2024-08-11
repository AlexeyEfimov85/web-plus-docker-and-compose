import { Injectable } from '@nestjs/common';
import { Wish } from './entities/wish.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private usersService: UsersService,
  ) {}

  async save(createWishDto: CreateWishDto) {
    return this.wishesRepository.save(createWishDto);
  }
  async create(userId: number, createWishDto: CreateWishDto) {
    const owner = await this.usersService.findById(userId);
    return this.wishesRepository.save({ ...createWishDto, owner });
  }

  async findWish(itemId: number) {
    return await this.wishesRepository.findOne({
      where: { id: itemId },
    });
  }

  async findWishById(ownerId: number) {
    return await this.wishesRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner'],
    });
  }

  async findWishByUserName(userName: string) {
    const user = await this.usersService.findOne({
      where: { username: userName },
    });
    return await this.wishesRepository.find({
      where: { owner: { id: user.id } },
      relations: ['owner'],
    });
  }

  async findWishesByOptions(option: FindManyOptions<Wish>) {
    return await this.wishesRepository.find(option);
  }

  async findWishByOptions(option: FindManyOptions<Wish>) {
    return await this.wishesRepository.findOne(option);
  }

  async updateWish(user: User, updateWishDto: UpdateWishDto, wishId: number) {
    const updatedWish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });
    if (updatedWish.owner.id === user.id) {
      return this.wishesRepository.save({ ...updatedWish, ...updateWishDto });
    }
  }

  async deleteWish(user: User, wishId: number) {
    const deletedWish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });
    if (deletedWish.owner.id === user.id) {
      return await this.wishesRepository.delete(deletedWish.id);
    }
  }

  async copyWish(user: User, wishId: number) {
    const copiedWish = await this.wishesRepository.findOne({
      where: { id: wishId },
      select: {
        name: true,
        link: true,
        image: true,
        price: true,
        description: true,
      },
    });
    const owner = await this.usersService.findById(user.id);
    const newWish = await this.wishesRepository.save({
      ...copiedWish,
      owner,
    });
    return newWish;
  }
}
