import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtConfigFactory } from 'src/config/jwt-config.factory';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigFactory,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtConfigFactory],
  exports: [AuthService],
})
export class AuthModule {}
