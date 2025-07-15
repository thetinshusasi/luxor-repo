import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { Collection } from './entities/collection.entity';
import { JwtModule } from '@nestjs/jwt';
import { ContextExtractInterceptor } from '../interceptors/context-extract/context-extract.interceptor';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection]),
    TokenModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-jwt-secret-key',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      },
    }),
  ],
  controllers: [CollectionController],
  providers: [CollectionService, ContextExtractInterceptor],
  exports: [CollectionService],
})
export class CollectionModule {}
