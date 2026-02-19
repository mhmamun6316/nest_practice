import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>(); // explicit type
    const user = request.user as { userId: string; role: string }; // type user

    const paramId = request.params['id']; // safe access

    if (user.role === 'admin') return true;

    if (user.userId !== paramId) {
      throw new ForbiddenException('You can only access your own resource');
    }

    return true;
  }
}
