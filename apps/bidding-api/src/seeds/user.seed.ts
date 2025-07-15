import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../models/enums/userRole';

const DEFAULT_PASSWORD = '12345';
const SALT_ROUNDS = 10;

export async function seedUsers(dataSource: DataSource): Promise<User[]> {
  const userRepository = dataSource.getRepository(User);

  // Check if users already exist
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log(
      `⚠️  ${existingUsers} users already exist in database. Skipping seed.`
    );
    return await userRepository.find();
  }

  console.log('🌱 Starting user seed...');

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  const users: Partial<User>[] = [];

  // Create specific admin and customer users
  const adminUser: Partial<User> = {
    name: 'Admin User',
    email: 'admin@gmail.com',
    hashedPassword,
    role: UserRole.ADMIN,
    isActive: true,
    isDeleted: false,
    isVerified: true,
    isAdmin: true,
  };

  const customerUser: Partial<User> = {
    name: 'Customer User',
    email: 'customer1@gmail.com',
    hashedPassword,
    role: UserRole.CUSTOMER,
    isActive: true,
    isDeleted: false,
    isVerified: true,
    isAdmin: false,
  };

  users.push(adminUser, customerUser);

  // Create 10 users with faker data
  for (let i = 0; i < 8; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;

    const user: Partial<User> = {
      name: fullName,
      email: faker.internet.email({ firstName, lastName }),
      hashedPassword,
      role: UserRole.CUSTOMER, // All faker users are customers
      isActive: true,
      isDeleted: false,
      isVerified: faker.datatype.boolean(),
      isAdmin: false,
    };

    users.push(user);
  }

  // Insert all users
  const createdUsers = await userRepository.save(users);

  console.log(`✅ Successfully seeded ${createdUsers.length} users`);
  console.log('📧 Default password for all users:', DEFAULT_PASSWORD);

  // Log the created users
  createdUsers.forEach((user, index) => {
    console.log(
      `${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}${
        user.isAdmin ? ' (Admin)' : ''
      }`
    );
  });

  return createdUsers;
}
