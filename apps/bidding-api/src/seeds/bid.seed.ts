import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Bid } from '../bid/entities/bid.entity';
import { Collection } from '../collection/entities/collection.entity';
import { User } from '../user/entities/user.entity';
import { BidStatus } from '@luxor-repo/shared';

export async function seedBids(
  dataSource: DataSource,
  collections: Collection[],
  users: User[]
): Promise<Bid[]> {
  const bidRepository = dataSource.getRepository(Bid);

  // Check if bids already exist
  const existingBids = await bidRepository.count();
  if (existingBids > 0) {
    console.log(
      `⚠️  ${existingBids} bids already exist in database. Skipping bid seed.`
    );
    return await bidRepository.find();
  }

  console.log('🌱 Starting bid seed...');

  const bids: Partial<Bid>[] = [];

  // Create 10 bids per collection
  for (const collection of collections) {
    for (let i = 0; i < 10; i++) {
      // Randomly select a user for this bid
      const randomUser =
        users[faker.number.int({ min: 0, max: users.length - 1 })];

      // Generate a bid price that's reasonable for the collection
      const basePrice = collection.price;
      const bidPrice =
        basePrice *
        faker.number.float({ min: 0.5, max: 1.5, multipleOf: 0.01 });

      const bid: Partial<Bid> = {
        collectionId: collection.id,
        userId: randomUser.id,
        price: parseFloat(bidPrice.toFixed(2)),
        status: faker.helpers.arrayElement([
          BidStatus.PENDING,
          BidStatus.ACCEPTED,
          BidStatus.REJECTED,
        ]),
        isDeleted: false,
      };

      bids.push(bid);
    }
  }

  // Insert all bids
  const createdBids = await bidRepository.save(bids);

  console.log(`✅ Successfully seeded ${createdBids.length} bids`);
  console.log(
    `📊 Average bids per collection: ${(
      createdBids.length / collections.length
    ).toFixed(1)}`
  );

  // Log some sample bids
  createdBids.slice(0, 5).forEach((bid, index) => {
    console.log(
      `${index + 1}. Bid $${bid.price} on Collection ${
        bid.collectionId
      } by User ${bid.userId} - Status: ${bid.status}`
    );
  });

  return createdBids;
}
