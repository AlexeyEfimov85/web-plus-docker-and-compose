import { ForbiddenException, Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashValue } from 'src/helpers/hash';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const possibleUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (possibleUser) {
      throw new ForbiddenException(
        'Пользователь с таким username или email уже существует',
      );
    }
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    return this.usersRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  findOne(query: FindOneOptions<User>) {
    return this.usersRepository.findOneOrFail(query);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const possibleUser = await this.usersRepository.findOne({
      where: [
        { username: updateUserDto.username },
        { email: updateUserDto.email },
      ],
    });
    if (possibleUser) {
      throw new ForbiddenException(
        'Пользователь с таким username или email уже существует',
      );
    }
    const user = await this.findById(id);
    if (password) {
      updateUserDto.password = await hashValue(password);
    }

    return this.usersRepository.save({ ...user, ...updateUserDto });
  }

  findMany(query: FindOneOptions<User>) {
    return this.usersRepository.findOneOrFail(query);
  }
}
