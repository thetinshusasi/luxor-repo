import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTokenDto } from './dto/create-token.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(tokenDto: CreateTokenDto): Promise<Token> {
    try {
      // Find the user first
      const user = await this.userRepository.findOne({
        where: { id: tokenDto.userId },
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${tokenDto.userId} not found`
        );
      }

      // Create the token with the user relationship
      const token = this.tokensRepository.create({
        user: user,
        token: tokenDto.token,
        expiresAt: tokenDto.expiresAt,
      });

      const result = await this.tokensRepository.save(token);

      if (!result) {
        throw new InternalServerErrorException('Failed to create token');
      }

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create token');
    }
  }

  async findByUserIdAndToken(
    userId: string,
    token: string
  ): Promise<Token | null> {
    try {
      const tokens = await this.tokensRepository.find({
        where: { user: { id: userId }, token },
      });

      return tokens.length !== 0 ? tokens[0] : null;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find token');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.tokensRepository.delete(id);

      if (!result || result.affected === 0) {
        throw new NotFoundException(`Token with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete token');
    }
  }
}
