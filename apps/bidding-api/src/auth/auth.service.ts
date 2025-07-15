import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ITokenPayload } from '../models/interfaces/token-payload';
import { UserRole } from '../models/enums/userRole';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokensService: TokenService
  ) {}

  async validateUser(
    email: string,
    pass: string
  ): Promise<Partial<User> | null> {
    const user = await this.userService.findByEmail(email);
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
        username: user.email,
        userId: user.id,
        role: user.role,
      };
      const accessToken = this.jwtService.sign(payload);
      const { userId, role, exp } = this.jwtService.decode(accessToken) as {
        userId: string;
        role: UserRole;
        exp: Date;
      };

      const { id } = await this.tokensService.create({
        id: '',
        user: { id: user.id } as User,
        token: accessToken,
        expiresAt: exp,
      });
      const tokenPayload: ITokenPayload = {
        tokenId: id,
        userId: userId,
        email: user.email || '',
        role: role,
        expiresAt: exp,
        token: accessToken,
      };

      return tokenPayload;
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Login failed');
    }
  }
}
