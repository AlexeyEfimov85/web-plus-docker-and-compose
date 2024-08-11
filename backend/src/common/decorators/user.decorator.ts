import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
//request будет обогащаться данными USER за счет использования гардов в контроллерах
export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    // в data в данном случае ничего не приходит -берется из параметра декоратора
    const request = ctx.switchToHttp().getRequest(); // получаем доступ к объекту запроса
    return request.user;
  },
);
