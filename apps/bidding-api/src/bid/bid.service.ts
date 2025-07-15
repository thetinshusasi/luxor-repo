import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
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
    try {
      if (!createBidDto) {
        throw new HttpException(
          'Create bid data is required',
          HttpStatus.BAD_REQUEST
        );
      }

      // Additional validation
      if (
        !createBidDto.collectionId ||
        createBidDto.collectionId.trim() === ''
      ) {
        throw new HttpException(
          'Collection ID is required',
          HttpStatus.BAD_REQUEST
        );
      }

      if (!createBidDto.userId || createBidDto.userId.trim() === '') {
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }

      if (!createBidDto.price || createBidDto.price <= 0) {
        throw new HttpException(
          'Valid price is required',
          HttpStatus.BAD_REQUEST
        );
      }

      const bid = this.bidRepository.create(createBidDto);
      const result = await this.bidRepository.save(bid);

      if (!result) {
        throw new HttpException(
          'Failed to create bid',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return convertBidEntityToBidDto(result, createBidDto.userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create bid',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
    userId: string
  ): Promise<BidDto[]> {
    try {
      if (!page || page < 1) {
        throw new HttpException(
          'Page must be a positive integer',
          HttpStatus.BAD_REQUEST
        );
      }

      if (!limit || limit < 1 || limit > 100) {
        throw new HttpException(
          'Limit must be between 1 and 100',
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.bidRepository.find({
        where: { isDeleted: false },
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return result.map((bid) => convertBidEntityToBidDto(bid, userId));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve bids',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string, userId: string): Promise<BidDto | null> {
    try {
      if (!id || id.trim() === '') {
        throw new HttpException('Bid ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.bidRepository.findOne({
        where: { id, isDeleted: false },
      });

      if (!result) {
        throw new NotFoundException(`Bid with ID ${id} not found`);
      }

      return convertBidEntityToBidDto(result, userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve bid',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: string,
    updateBidDto: UpdateBidDto,
    userId: string
  ): Promise<BidDto> {
    try {
      if (!id || id.trim() === '') {
        throw new HttpException('Bid ID is required', HttpStatus.BAD_REQUEST);
      }

      if (!updateBidDto || Object.keys(updateBidDto).length === 0) {
        throw new HttpException(
          'Update data is required',
          HttpStatus.BAD_REQUEST
        );
      }

      // Check if bid exists
      const existingBid = await this.findOne(id, userId);
      if (!existingBid || !existingBid.isOwner) {
        throw new NotFoundException(`Bid with ID ${id} not found`);
      }

      // Validate update data
      if (
        updateBidDto.collectionId !== undefined &&
        (!updateBidDto.collectionId || updateBidDto.collectionId.trim() === '')
      ) {
        throw new HttpException(
          'Collection ID cannot be empty',
          HttpStatus.BAD_REQUEST
        );
      }

      if (
        updateBidDto.userId !== undefined &&
        (!updateBidDto.userId || updateBidDto.userId.trim() === '')
      ) {
        throw new HttpException(
          'User ID cannot be empty',
          HttpStatus.BAD_REQUEST
        );
      }

      if (
        updateBidDto.price !== undefined &&
        (!updateBidDto.price || updateBidDto.price <= 0)
      ) {
        throw new HttpException(
          'Price must be positive',
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.bidRepository.update(id, updateBidDto);

      if (!result || result.affected === 0) {
        throw new HttpException(
          'Failed to update bid',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      // Fetch the updated bid entity after update
      const updatedBidEntity = await this.bidRepository.findOne({
        where: { id },
      });
      if (!updatedBidEntity) {
        throw new NotFoundException(`Bid with ID ${id} not found after update`);
      }
      return convertBidEntityToBidDto(updatedBidEntity, userId);
    } catch (error) {
      if (
        error instanceof HttpException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new HttpException(
        'Failed to update bid',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string, userId: string): Promise<BidDto> {
    try {
      if (!id || id.trim() === '') {
        throw new HttpException('Bid ID is required', HttpStatus.BAD_REQUEST);
      }

      // Check if bid exists and get the DTO
      const existingBidDto = await this.findOne(id, userId);
      if (!existingBidDto || !existingBidDto.isOwner) {
        throw new NotFoundException(`Bid with ID ${id} not found`);
      }

      const result = await this.bidRepository.update(id, {
        isDeleted: true,
      });

      if (!result || result.affected === 0) {
        throw new HttpException(
          'Failed to delete bid',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return existingBidDto;
    } catch (error) {
      if (
        error instanceof HttpException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete bid',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
