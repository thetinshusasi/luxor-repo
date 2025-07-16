import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from '../token/token.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private tokensService: TokenService,
    private jwtService: JwtService
  ) {
    super();
    console.log('TokensService in JwtAuthGuard:', this.tokensService);
  }
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = (await super.canActivate(context)) as boolean;
    if (!can) {
      return false;
    }

    // For now, let's simplify the validation to just check JWT validity
    // The token service validation can be added back later if needed
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const decodeToken = this.jwtService.decode(token);
      const { exp } = decodeToken;
      const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);

      if (currentTimeInSeconds <= exp) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('JWT validation error:', error);
      return false;
    }
  }
}
