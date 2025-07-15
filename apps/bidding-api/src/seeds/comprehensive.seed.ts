import { DataSource } from 'typeorm';
import { seedUsers } from './user.seed';
import { seedCollections } from './collection.seed';
import { seedBids } from './bid.seed';
import { User } from '../user/entities/user.entity';
import { Collection } from '../collection/entities/collection.entity';
import { Bid } from '../bid/entities/bid.entity';

export async function comprehensiveSeed(dataSource: DataSource): Promise<{
  users: User[];
  collections: Collection[];
  bids: Bid[];
}> {
  console.log('🚀 Starting comprehensive database seeding...');
  console.log('==============================================');

  try {
    // Step 1: Seed Users (required for foreign key relationships)
    console.log('\n👥 Step 1: Seeding Users...');
    const users = await seedUsers(dataSource);
    console.log(`✅ Users seeded: ${users.length}`);

    // Step 2: Seed Collections (required for bid foreign keys)
    console.log('\n📦 Step 2: Seeding Collections...');
    const collections = await seedCollections(dataSource);
    console.log(`✅ Collections seeded: ${collections.length}`);

    // Step 3: Seed Bids (depends on both users and collections)
    console.log('\n💰 Step 3: Seeding Bids...');
    const bids = await seedBids(dataSource, collections, users);
    console.log(`✅ Bids seeded: ${bids.length}`);

    console.log('\n==============================================');
    console.log('🎉 Comprehensive seeding completed successfully!');
    console.log('📊 Final Statistics:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📦 Collections: ${collections.length}`);
    console.log(`   💰 Bids: ${bids.length}`);
    console.log(
      `   📈 Average bids per collection: ${(
        bids.length / collections.length
      ).toFixed(1)}`
    );
    console.log('==============================================');

    return { users, collections, bids };
  } catch (error) {
    console.error('❌ Comprehensive seeding failed:', error);
    throw error;
  }
}
