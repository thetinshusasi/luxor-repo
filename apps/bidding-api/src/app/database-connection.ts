import { DataSource } from 'typeorm';

export async function checkDatabaseConnection(): Promise<void> {
  try {
    const dataSource = getDataSource();

    // Try to initialize the connection
    await dataSource.initialize();

    // Test a simple query
    const result = await dataSource.query('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    console.log('📊 Test query result:', result);

    // Close the connection
    await dataSource.destroy();
    console.log('🔒 Database connection closed');
  } catch (error: any) {
    console.error('❌ Database connection failed!');
    console.error('Error details:', error);

    // Provide helpful error messages
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Possible solutions:');
      console.error('   1. Make sure PostgreSQL is running');
      console.error('   2. Check if the database port is correct');
      console.error('   3. Verify Docker containers are up (if using Docker)');
      console.error('   4. Run: npx nx run bidding-api:db-up');
    } else if (error.code === '28P01') {
      console.error(
        '💡 Authentication failed. Check your database credentials.'
      );
    } else if (error.code === '3D000') {
      console.error('💡 Database does not exist. Check your database name.');
    }

    // Don't throw here to allow the app to continue
  }
}

import { User } from '../user/entities/user.entity';
import { Collection } from '../collection/entities/collection.entity';
import { Bid } from '../bid/entities/bid.entity';
import { Auth } from '../auth/entities/auth.entity';

export const getDataSource = (): DataSource => {
  const config = {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'luxor_bidding',
    entities: [User, Collection, Bid, Auth],
    synchronize: false,
  };
  return new DataSource(config);
};
