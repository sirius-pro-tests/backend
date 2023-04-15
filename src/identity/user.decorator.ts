import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';

export const InjectUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const user: UserModel = request.user;

        return user;
    }
);
