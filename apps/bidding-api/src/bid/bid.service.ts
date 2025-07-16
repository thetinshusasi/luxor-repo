import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Bid } from './entities/bid.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { convertBidEntityToBidDto } from '../common/utils/convertBidEnitityToBidDto';
import { BidDto } from './dto/bid.dto';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>
  ) {}

  async create(createBidDto: CreateBidDto): Promise<BidDto> {
    if (!createBidDto) {
      throw new BadRequestException('Create bid data is required');
    }

    // Additional validation
    if (!createBidDto.collectionId || createBidDto.collectionId.trim() === '') {
      throw new BadRequestException('Collection ID is required');
    }

    if (!createBidDto.userId || createBidDto.userId.trim() === '') {
      throw new BadRequestException('User ID is required');
    }

    if (!createBidDto.price || createBidDto.price <= 0) {
      throw new BadRequestException('Valid price is required');
    }

    const bid = this.bidRepository.create(createBidDto);
    const result = await this.bidRepository.save(bid);

    if (!result) {
      throw new InternalServerErrorException('Failed to create bid');
    }

    return convertBidEntityToBidDto(result, createBidDto.userId);
  }

  async findAll(
    page: number,
    limit: number,
    userId: string
  ): Promise<BidDto[]> {
    if (!page || page < 1) {
      throw new BadRequestException('Page must be a positive integer');
    }

    if (!limit || limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    const result = await this.bidRepository.find({
      where: { isDeleted: false },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return result.map((bid) => convertBidEntityToBidDto(bid, userId));
  }

  async findOne(id: string, userId: string): Promise<BidDto> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Bid ID is required');
    }

    const result = await this.bidRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!result) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }

    return convertBidEntityToBidDto(result, userId);
  }

  async update(
    id: string,
    updateBidDto: UpdateBidDto,
    userId: string
  ): Promise<BidDto> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Bid ID is required');
    }

    if (!updateBidDto || Object.keys(updateBidDto).length === 0) {
      throw new BadRequestException('Update data is required');
    }

    // Check if bid exists
    const existingBid = await this.findOne(id, userId);
    if (!existingBid.isOwner) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }

    // Validate update data
    if (
      updateBidDto.collectionId !== undefined &&
      (!updateBidDto.collectionId || updateBidDto.collectionId.trim() === '')
    ) {
      throw new BadRequestException('Collection ID cannot be empty');
    }

    if (
      updateBidDto.userId !== undefined &&
      (!updateBidDto.userId || updateBidDto.userId.trim() === '')
    ) {
      throw new BadRequestException('User ID cannot be empty');
    }

    if (
      updateBidDto.price !== undefined &&
      (!updateBidDto.price || updateBidDto.price <= 0)
    ) {
      throw new BadRequestException('Price must be positive');
    }

    const result = await this.bidRepository.update(id, updateBidDto);

    if (!result || result.affected === 0) {
      throw new InternalServerErrorException('Failed to update bid');
    }

    // Fetch the updated bid entity after update
    const updatedBidEntity = await this.bidRepository.findOne({
      where: { id },
    });
    if (!updatedBidEntity) {
      throw new NotFoundException(`Bid with ID ${id} not found after update`);
    }
    return convertBidEntityToBidDto(updatedBidEntity, userId);
  }

  async remove(id: string, userId: string): Promise<BidDto> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Bid ID is required');
    }

    // Check if bid exists and get the DTO
    const existingBidDto = await this.findOne(id, userId);
    if (!existingBidDto.isOwner) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }

    const result = await this.bidRepository.update(id, {
      isDeleted: true,
    });

    if (!result || result.affected === 0) {
      throw new InternalServerErrorException('Failed to delete bid');
    }

    return existingBidDto;
  }
}
