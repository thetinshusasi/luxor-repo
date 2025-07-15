import { Injectable } from '@nestjs/common';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTokenDto } from './dto/create-token.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>
  ) {}

  async create(token: CreateTokenDto): Promise<Token> {
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
