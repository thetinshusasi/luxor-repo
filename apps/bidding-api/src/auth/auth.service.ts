import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
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

      const user = await this.validateUser(email, password);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        userId: user.id,
        email: user.email,
        sub: user.id, // JWT standard uses 'sub' for subject/user ID
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload);

      const decodedToken = this.jwtService.decode(accessToken) as {
        userId: string;
        email: string;
        sub: string;
        role: UserRole;
        exp: number;
      };

      if (!decodedToken.userId) {
        throw new BadRequestException('User ID is required');
      }

      // Convert the JWT exp timestamp to a Date object
      const expiresAt = new Date(decodedToken.exp * 1000);

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
      this.logger.error('Error during login:', error);

      throw new InternalServerErrorException('Login failed');
    }
  }
}
