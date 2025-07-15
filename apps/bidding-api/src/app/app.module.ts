import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { CollectionModule } from '../collection/collection.module';
import { BidModule } from '../bid/bid.module';
import { AuthModule } from '../auth/auth.module';
import { checkDatabaseConnection, getDataSource } from './database-connection';
import { comprehensiveSeed } from '../seeds/comprehensive.seed';
import { cleanDatabase } from '../seeds/cleanDatabase';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'luxor_bidding',
      autoLoadEntities: true,
      synchronize: false, // Disable synchronize for production
      migrations: ['src/migrations/*.ts'],
      migrationsRun: true, // Run migrations automatically
    }),
    UserModule,
    CollectionModule,
    BidModule,
    AuthModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    // Check database connection when the module is initialized
  }

  async onModuleInit() {
    await checkDatabaseConnection();
    console.log('--------------------------------');
    console.log('Environment Variables Debug:');
    console.log('DB_NAME:', this.configService.get('DB_NAME'));
    console.log('DB_HOST:', this.configService.get('DB_HOST'));
    console.log('DB_PORT:', this.configService.get('DB_PORT'));
    console.log('DB_USER:', this.configService.get('DB_USER'));
    console.log('DB_PASSWORD:', this.configService.get('DB_PASSWORD'));
    console.log('JWT_SECRET:', this.configService.get('JWT_SECRET'));
    console.log('JWT_EXPIRES_IN:', this.configService.get('JWT_EXPIRES_IN'));
    console.log('process.env.JWT_SECRET:', process.env.JWT_SECRET);
    console.log('process.env.JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);
    console.log('--------------------------------');
    if (process.env.NODE_ENV === 'development') {
      const dataSource = getDataSource();
      await cleanDatabase(dataSource);
      await comprehensiveSeed(dataSource);
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
