import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(
    @AuthUser() user /*@Body()  signinUserDto: SigninUserDto */,
  ): Promise<any> {
    console.log(user);

    return this.authService.login(user);
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.signup(createUserDto);
    return user;
  }
}
