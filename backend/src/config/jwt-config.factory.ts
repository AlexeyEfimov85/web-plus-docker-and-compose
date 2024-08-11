import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigFactory implements JwtOptionsFactory {
  constructor(private configservice: ConfigService) {}
  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configservice.get<string>('jwt.secret'),
      signOptions: {
        expiresIn: this.configservice.get<string>('jwt.ttl', '300s'),
      },
    };
  }
}
