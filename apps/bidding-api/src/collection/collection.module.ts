import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { Collection } from './entities/collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
