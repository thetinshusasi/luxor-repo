import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Collection } from '../collection/entities/collection.entity';

export async function seedCollections(
  dataSource: DataSource
): Promise<Collection[]> {
  const collectionRepository = dataSource.getRepository(Collection);

  // Check if collections already exist
  const existingCollections = await collectionRepository.count();
  if (existingCollections > 0) {
    console.log(
      `⚠️  ${existingCollections} collections already exist in database. Skipping collection seed.`
    );
    return await collectionRepository.find();
  }

  console.log('🌱 Starting collection seed...');

  const collections: Partial<Collection>[] = [];

  // Create 100 collections with faker data
  for (let i = 0; i < 100; i++) {
    const collection: Partial<Collection> = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      image: faker.image.url({ width: 400, height: 300 }),
      stock: faker.number.int({ min: 1, max: 100 }),
      price: parseFloat(faker.commerce.price({ min: 10, max: 10000 })),
      isDeleted: false,
    };

    collections.push(collection);
  }

  // Insert all collections
  const createdCollections = await collectionRepository.save(collections);

  console.log(
    `✅ Successfully seeded ${createdCollections.length} collections`
  );

  // Log some sample collections
  createdCollections.slice(0, 5).forEach((collection, index) => {
    console.log(
      `${index + 1}. ${collection.name} - $${collection.price} - Stock: ${
        collection.stock
      }`
    );
  });

  return createdCollections;
}
