import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { Bid } from './entities/bid.entity';
import { TokenModule } from '../token/token.module';
import { JwtModule } from '@nestjs/jwt';
import { ContextExtractInterceptor } from '../interceptors/context-extract/context-extract.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid]),
    TokenModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-jwt-secret-key',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      },
    }),
  ],
  controllers: [BidController],
  providers: [BidService, ContextExtractInterceptor],
  // exports: [BidService],
})
export class BidModule {}
