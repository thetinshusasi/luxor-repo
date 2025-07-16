import { Injectable, NotFoundException } from '@nestjs/common';
import { Not, DataSource, In } from 'typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { convertCollectionEnitityToCollectionDto } from '../common/utils/convertCollectionEnitityToCollectionDto';
import { CollectionDto } from './dto/collection.dto';
import { Bid } from '../bid/entities/bid.entity';
import { BidDto } from '../bid/dto/bid.dto';
import { convertBidEntityToBidDto } from '../common/utils/convertBidEnitityToBidDto';
import { BidStatus } from '../models/enums/bidStatus';
import { CollectionListDto } from './dto/collection-list.dto';
import { CollectionBidListDto } from './dto/collection-bid-list.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    private dataSource: DataSource
  ) {}

  create(createCollectionDto: CreateCollectionDto) {
    return this.collectionRepository.save(createCollectionDto);
  }

  async findAll(
    page: number,
    limit: number,
    userId: string
  ): Promise<CollectionListDto> {
    const totalCount = await this.collectionRepository.count({
      where: { isDeleted: false },
    });
    const collections = await this.collectionRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      where: { isDeleted: false }, // Only show non-deleted collections
    });
    const collectionListDto: CollectionListDto = {
      data: collections.map((collection: Collection) =>
        convertCollectionEnitityToCollectionDto(collection, userId)
      ),
      pageSize: limit,
      page,
      totalPages: Math.ceil(totalCount / limit),
    };
    return collectionListDto;
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

    return this.dataSource.transaction(async (manager) => {
      // Mark the collection as deleted
      await manager.update(Collection, id, {
        isDeleted: true,
      });

      // Update all bids related to this collection
      // Set status as rejected and isDeleted as true
      await manager.update(
        Bid,
        { collectionId: id, isDeleted: false },
        {
          status: BidStatus.REJECTED,
          isDeleted: true,
        }
      );

      const updatedCollection = await manager.findOne(Collection, {
        where: { id, isDeleted: true, userId },
      });
      if (!updatedCollection) {
        throw new NotFoundException('Collection not found');
      }

      return convertCollectionEnitityToCollectionDto(updatedCollection, userId);
    });
  }

  async getAllCollectionByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<CollectionListDto> {
    const totalCount = await this.collectionRepository.count({
      where: { userId, isDeleted: false },
    });
    const collections = await this.collectionRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      where: { userId, isDeleted: false },
    });
    const collectionListDto: CollectionListDto = {
      data: collections.map((collection: Collection) =>
        convertCollectionEnitityToCollectionDto(collection, userId)
      ),
      pageSize: limit,
      page,
      totalPages: Math.ceil(totalCount / limit),
    };
    return collectionListDto;
  }

  async getAllBidsByCollectionId(
    collectionId: string,
    userId: string
  ): Promise<BidDto[]> {
    const bids = await this.bidRepository.find({
      where: { collectionId, isDeleted: false },
    });
    return bids.map((bid: Bid) => convertBidEntityToBidDto(bid, userId));
  }

  async acceptBidByCollectionId(
    collectionId: string,
    bidId: string,
    userId: string
  ): Promise<BidDto> {
    return this.dataSource.transaction(async (manager) => {
      // Find the bid to accept
      const bid = await manager.findOne(Bid, {
        where: { id: bidId, collectionId, isDeleted: false },
      });
      if (!bid) {
        throw new NotFoundException('Bid not found');
      }

      // Accept the selected bid
      await manager.update(Bid, bidId, {
        status: BidStatus.ACCEPTED,
      });

      // Reject all other bids for this collection (except the accepted one)
      await manager.update(
        Bid,
        {
          collectionId,
          isDeleted: false,
          id: Not(bidId),
        },
        {
          status: BidStatus.REJECTED,
        }
      );

      // Return the accepted bid
      const acceptedBid = await manager.findOne(Bid, {
        where: { id: bidId, collectionId, isDeleted: false },
      });

      if (!acceptedBid) {
        throw new NotFoundException('Accepted bid not found');
      }

      return convertBidEntityToBidDto(acceptedBid, userId);
    });
  }

  async getAllBidsByCollectionIds(
    collectionIds: string[],
    userId: string
  ): Promise<CollectionBidListDto[]> {
    // Get all bids for the specified collections (not filtered by userId to get all bids)
    const bids = await this.bidRepository.find({
      where: { collectionId: In(collectionIds), isDeleted: false },
    });

    // Group bids by collectionId using Map for O(1) lookup
    const bidsByCollection = new Map<string, Bid[]>();

    // Initialize all collection IDs with empty arrays
    collectionIds.forEach((collectionId) => {
      bidsByCollection.set(collectionId, []);
    });

    // Group existing bids by collectionId
    bids.forEach((bid) => {
      const existingBids = bidsByCollection.get(bid.collectionId) || [];
      existingBids.push(bid);
      bidsByCollection.set(bid.collectionId, existingBids);
    });

    // Convert to DTO format
    return collectionIds.map((collectionId) => ({
      collectionId,
      bids: (bidsByCollection.get(collectionId) || []).map((bid) =>
        convertBidEntityToBidDto(bid, userId)
      ),
    }));
  }
}
