import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Collection } from '../collection/entities/collection.entity';
import { Bid } from '../bid/entities/bid.entity';

async function clearBids(dataSource: DataSource): Promise<void> {
  try {
    console.log('🗑️  Clearing bids...');
    const bidRepository = dataSource.getRepository(Bid);
    await bidRepository.deleteAll();
    console.log('✅ Cleared bids');
  } catch (error: any) {
    console.error('❌ Failed to clear bids:', error.message);
  }
}

async function clearCollections(dataSource: DataSource): Promise<void> {
  try {
    console.log('🗑️  Clearing collections...');
    const collectionRepository = dataSource.getRepository(Collection);
    await collectionRepository.deleteAll();
    console.log('✅ Cleared collections');
  } catch (error: any) {
    console.error('❌ Failed to clear collections:', error.message);
  }
}

async function clearUsers(dataSource: DataSource): Promise<void> {
  try {
    console.log('🗑️  Clearing users...');
    const userRepository = dataSource.getRepository(User);
    await userRepository.deleteAll();
    console.log('✅ Cleared users');
  } catch (error: any) {
    console.error('❌ Failed to clear users:', error.message);
  }
}

export const cleanDatabase = async (dataSource: DataSource): Promise<void> => {
  try {
    // Initialize the DataSource if not already initialized
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    console.log(
      '🧹 Clearing user, bid, and collection tables (keeping schema)...'
    );

    // Clear tables in the correct order to handle foreign key constraints
    // Clear child tables first, then parent tables (bid references user and collection)
    await clearBids(dataSource);
    await clearCollections(dataSource);
    await clearUsers(dataSource);

    console.log('✅ Database tables cleared successfully (schema preserved)');
  } catch (error: any) {
    console.error('❌ Database cleaning failed:', error);
  }
};
