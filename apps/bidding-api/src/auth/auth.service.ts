import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ITokenPayload } from '../models/interfaces/token-payload';
import { UserRole } from '../models/enums/userRole';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokensService: TokenService,
    private logger: Logger
  ) {}

  async validateUser(
    email: string,
    pass: string
  ): Promise<Partial<User> | null> {
    this.logger.debug('email', email);
    const user = await this.userService.findByEmail(email);
    this.logger.debug('user', user);
    if (user && (await bcrypt.compare(pass, user.hashedPassword))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      console.log('🔍 Login attempt for email:', email);

      const user = await this.validateUser(email, password);
      console.log('🔍 User validation result:', user ? 'SUCCESS' : 'FAILED');

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        userId: user.id,
        email: user.email,
        sub: user.id, // JWT standard uses 'sub' for subject/user ID
        role: user.role,
      };
      console.log('🔍 JWT Payload:', payload);
      console.log('🔍 JWT Service instance:', this.jwtService);
      console.log('🔍 About to sign JWT...');

      const accessToken = this.jwtService.sign(payload);
      console.log(
        '🔍 JWT Token created successfully:',
        accessToken.substring(0, 50) + '...'
      );

      const decodedToken = this.jwtService.decode(accessToken) as {
        userId: string;
        email: string;
        sub: string;
        role: UserRole;
        exp: number;
      };

      if (!decodedToken.userId) {
        throw new Error('User ID is required');
      }

      // Convert the JWT exp timestamp to a Date object
      const expiresAt = new Date(decodedToken.exp * 1000);

      console.log('========================================');
      console.log('user', user);
      console.log('========================================');

      const { id } = await this.tokensService.create({
        userId: user.id || '',
        token: accessToken,
        expiresAt: expiresAt,
      });
      const tokenPayload: ITokenPayload = {
        tokenId: id,
        // userId: decodedToken.userId,
        email: user.email || '',
        role: decodedToken.role,
        expiresAt: expiresAt,
        token: accessToken,
      };

      return tokenPayload;
    } catch (error) {
      console.error('❌ Error during login:', error);
      console.error(
        '❌ Error stack:',
        error instanceof Error ? error.stack : 'Unknown error'
      );
      throw new Error('Login failed');
    }
  }
}
