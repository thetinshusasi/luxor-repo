import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from '../token/token.module';
import { ContextExtractInterceptor } from '../interceptors/context-extract/context-extract.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TokenModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-jwt-secret-key',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, ContextExtractInterceptor],
  exports: [UserService],
})
export class UserModule {}
