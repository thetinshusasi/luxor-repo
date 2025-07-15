import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { convertCollectionEnitityToCollectionDto } from '../common/utils/convertCollectionEnitityToCollectionDto';
import { CollectionDto } from './dto/collection.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>
  ) {}

  create(createCollectionDto: CreateCollectionDto) {
    return this.collectionRepository.save(createCollectionDto);
  }

  async findAll(
    page: number,
    limit: number,
    userId: string
  ): Promise<CollectionDto[]> {
    const collections = await this.collectionRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      where: { isDeleted: false }, // Only show non-deleted collections
    });
    return collections.map((collection: Collection) =>
      convertCollectionEnitityToCollectionDto(collection, userId)
    );
  }

  async findOne(id: string, userId: string): Promise<CollectionDto> {
    const collection = await this.collectionRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    return convertCollectionEnitityToCollectionDto(collection, userId);
  }

  async findByUserId(userId: string): Promise<CollectionDto[]> {
    const collections = await this.collectionRepository.find({
      where: { userId, isDeleted: false },
    });
    return collections.map((collection: Collection) =>
      convertCollectionEnitityToCollectionDto(collection, userId)
    );
  }

  async update(
    id: string,
    updateCollectionDto: UpdateCollectionDto,
    userId: string
  ): Promise<CollectionDto> {
    const collection = await this.collectionRepository.findOne({
      where: { id, isDeleted: false, userId },
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    await this.collectionRepository.update(id, updateCollectionDto);
    const updatedCollection = await this.collectionRepository.findOne({
      where: { id, isDeleted: false, userId },
    });
    if (!updatedCollection) {
      throw new NotFoundException('Collection not found');
    }
    return convertCollectionEnitityToCollectionDto(updatedCollection, userId);
  }

  async remove(id: string, userId: string): Promise<CollectionDto> {
    const collection = await this.collectionRepository.findOne({
      where: { id, isDeleted: false, userId },
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    await this.collectionRepository.update(id, {
      isDeleted: true,
    });

    const updatedCollection = await this.collectionRepository.findOne({
      where: { id, isDeleted: true, userId },
    });
    if (!updatedCollection) {
      throw new NotFoundException('Collection not found');
    }

    return convertCollectionEnitityToCollectionDto(updatedCollection, userId);
  }
}
