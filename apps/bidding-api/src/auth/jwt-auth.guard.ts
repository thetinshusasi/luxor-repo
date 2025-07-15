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
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];

    const decodeToken = this.jwtService.decode(token);
    const { userId, exp } = decodeToken;
    const latestToken = await this.tokensService.findByUserIdAndToken(
      userId,
      token
    );
    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
    if (latestToken && currentTimeInSeconds <= exp) {
      return true;
    }
    return false;
  }
}
