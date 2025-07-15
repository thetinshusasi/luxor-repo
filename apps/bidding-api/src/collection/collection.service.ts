import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>
  ) {}
  create(createCollectionDto: CreateCollectionDto) {
    return this.collectionRepository.save(createCollectionDto);
  }

  findAll(page: number, limit: number) {
    return this.collectionRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOne(id: string) {
    return this.collectionRepository.findOne({ where: { id } });
  }

  update(id: string, updateCollectionDto: UpdateCollectionDto) {
    return this.collectionRepository.update(id, updateCollectionDto);
  }

  remove(id: string) {
    return this.collectionRepository.update(id, {
      isDeleted: true,
    });
  }
}
