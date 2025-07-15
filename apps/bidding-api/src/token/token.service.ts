import { Injectable } from '@nestjs/common';
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
    console.log('========================================');
    console.log('tokenDto', tokenDto);
    console.log('========================================');

    // Find the user first
    const user = await this.userRepository.findOne({
      where: { id: tokenDto.userId },
    });

    if (!user) {
      throw new Error(`User with ID ${tokenDto.userId} not found`);
    }

    console.log('========================================');
    console.log('user found', user);
    console.log('========================================');

    // Create the token with the user relationship
    const token = this.tokensRepository.create({
      user: user,
      token: tokenDto.token,
      expiresAt: tokenDto.expiresAt,
    });

    return this.tokensRepository.save(token);
  }

  async findByUserIdAndToken(
    userId: string,
    token: string
  ): Promise<Token | null> {
    const tokens = await this.tokensRepository.find({
      where: { user: { id: userId }, token },
    });

    return tokens.length !== 0 ? tokens[0] : null;
  }

  async delete(id: number): Promise<void> {
    await this.tokensRepository.delete(id);
  }
}
