import { DataSource } from 'typeorm';

export const cleanDatabase = async (dataSource: DataSource): Promise<void> => {
  try {
    await dataSource.initialize();

    console.log('🧹 Cleaning database...');

    // Drop all tables (this will delete all data)
    await dataSource.dropDatabase();

    console.log('✅ Database cleaned successfully');

    await dataSource.destroy();
  } catch (error: any) {
    console.error('❌ Database cleaning failed:', error);
  }
};
