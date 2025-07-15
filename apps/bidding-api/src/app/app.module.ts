import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
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
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        // Import here to avoid circular dependency

        const config = {
          type: 'postgres' as const,
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          username: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'password',
          database: process.env.DB_NAME || 'luxor_bidding',
          autoLoadEntities: true,
          synchronize: false, // Disable synchronize for production
          migrations: ['src/migrations/*.ts'],
          migrationsRun: true, // Run migrations automatically
        };

        return config;
      },
    }),
    UserModule,
    CollectionModule,
    BidModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor() {
    // Check database connection when the module is initialized
  }

  async onModuleInit() {
    await checkDatabaseConnection();

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
