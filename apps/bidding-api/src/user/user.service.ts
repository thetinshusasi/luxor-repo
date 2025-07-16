import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    // Hash the password
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with hashed password
    const userToCreate = {
      ...userData,
      hashedPassword,
    };

    return this.userRepository.save(userToCreate);
  }

  findAll(page: number, limit: number) {
    return this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: string): Promise<User> {
    if (!id) {
      throw new NotFoundException('User ID is required');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...userData } = updateUserDto;

    // Hash the password if it exists
    let hashedPassword: string | undefined;
    if (password) {
      const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // Prepare update data
    const updateData = hashedPassword
      ? { ...userData, hashedPassword }
      : userData;

    await this.userRepository.update(id, updateData);
    return this.userRepository.findOne({ where: { id } });
  }

  remove(id: string) {
    return this.userRepository.update(id, {
      isActive: false,
      isDeleted: true,
    });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
