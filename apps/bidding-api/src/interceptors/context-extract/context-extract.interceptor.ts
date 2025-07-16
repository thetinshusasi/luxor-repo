import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { IRequestContext } from '../../models/interfaces/request-context';

@Injectable()
export class ContextExtractInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authorizationHeader.replace('Bearer ', '');

    try {
      const reqContext: IRequestContext = this.jwtService.verify(token);
      const userId = reqContext.userId;
      if (!userId) {
        throw new UnauthorizedException('User ID not found in token');
      }

      request.context = { ...reqContext };
    } catch (error: any) {
      throw new UnauthorizedException(
        'Invalid token',
        error && typeof error === 'object' && 'message' in error
          ? error.message
          : undefined
      );
    }

    return next.handle();
  }
}
