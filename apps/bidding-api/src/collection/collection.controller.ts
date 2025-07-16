import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UseGuards,
  InternalServerErrorException,
  NotFoundException,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ContextExtractInterceptor } from '../interceptors/context-extract/context-extract.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Collection } from './entities/collection.entity';
import { Logger } from 'nestjs-pino';
import { IRequestContext } from '../models/interfaces/request-context';
import { CollectionDto } from './dto/collection.dto';
import { BidDto } from '../bid/dto/bid.dto';
import { AcceptBidDto } from './dto/accept-bid.dto';
import { CollectionListDto } from './dto/collection-list.dto';

@ApiTags('Collections')
@ApiBearerAuth('access-token')
@UseInterceptors(ContextExtractInterceptor)
@Controller('collections')
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly logger: Logger
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new collection' })
  @ApiResponse({
    status: 201,
    description: 'The collection has been successfully created.',
    type: Collection,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async create(
    @Body() createCollectionDto: CreateCollectionDto,
    @Request() req: { context: IRequestContext }
  ) {
    try {
      if (
        !createCollectionDto ||
        Object.keys(createCollectionDto).length === 0
      ) {
        throw new InternalServerErrorException('Collection data is required');
      }

      const { userId } = req.context;
      if (!userId) {
        throw new BadRequestException('User ID not found in request context');
      }
      createCollectionDto.userId = userId;

      const collection = await this.collectionService.create(
        createCollectionDto
      );

      if (!collection) {
        throw new InternalServerErrorException('Failed to create collection');
      }

      return collection;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      this.logger.error('Error creating collection', error);
      throw new InternalServerErrorException('Error creating collection');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all collections' })
  @ApiResponse({
    status: 200,
    description: 'The collections have been successfully retrieved.',
    type: [Collection],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async findAll(
    @Request() req: { context: IRequestContext },
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<CollectionListDto> {
    try {
      console.log('========================================');
      console.log('page', page);
      console.log('limit', limit);
      console.log('========================================');
      if (page < 1 || limit < 1) {
        throw new InternalServerErrorException(
          'Page and limit must be positive numbers'
        );
      }
      const userId = req.context.userId;
      const collectionDtos = await this.collectionService.findAll(
        page,
        limit,
        userId
      );

      if (!collectionDtos) {
        throw new InternalServerErrorException(
          'Failed to retrieve collections'
        );
      }

      return collectionDtos;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      this.logger.error('Error fetching collections', error);
      throw new InternalServerErrorException('Error fetching collections');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('userCollections')
  @ApiOperation({ summary: 'Get all collections by user ID' })
  @ApiResponse({
    status: 200,
    description: 'The collections have been successfully retrieved.',
    type: [Collection],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async getAllCollectionByUserId(
    @Request() req: { context: IRequestContext },
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<CollectionListDto> {
    try {
      const userId = req.context.userId;
      if (!userId || userId.trim() === '') {
        throw new NotFoundException('User ID is required');
      }
      if (page < 1 || limit < 1) {
        throw new BadRequestException(
          'Page and limit must be positive numbers'
        );
      }

      const collections = await this.collectionService.getAllCollectionByUserId(
        userId,
        page,
        limit
      );

      if (!collections) {
        throw new InternalServerErrorException(
          'Failed to retrieve collections for user'
        );
      }

      return collections;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      this.logger.error(
        `Error fetching all collections for user ${req.context.userId}`,
        error
      );
      throw new InternalServerErrorException(
        'Error fetching all collections for user'
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get collections by user ID' })
  @ApiResponse({
    status: 200,
    description: 'The collections have been successfully retrieved.',
    type: [Collection],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async findByUserId(
    @Param('userId') userId: string
  ): Promise<CollectionDto[]> {
    try {
      if (!userId || userId.trim() === '') {
        throw new NotFoundException('User ID is required');
      }

      const collections = await this.collectionService.findByUserId(userId);

      if (!collections) {
        throw new InternalServerErrorException(
          'Failed to retrieve collections for user'
        );
      }

      return collections;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      this.logger.error(`Error fetching collections for user ${userId}`, error);
      throw new InternalServerErrorException(
        'Error fetching collections for user'
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':collectionId/bids')
  @ApiOperation({ summary: 'Get all bids for a collection' })
  @ApiResponse({
    status: 200,
    description: 'The bids have been successfully retrieved.',
    type: [BidDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async getAllBidsByCollectionId(
    @Param('collectionId') collectionId: string,
    @Request() req: { context: IRequestContext }
  ): Promise<BidDto[]> {
    try {
      if (!collectionId || collectionId.trim() === '') {
        throw new NotFoundException('Collection ID is required');
      }

      const bids = await this.collectionService.getAllBidsByCollectionId(
        collectionId,
        req.context.userId
      );

      if (!bids) {
        throw new InternalServerErrorException(
          'Failed to retrieve bids for collection'
        );
      }

      return bids;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      this.logger.error(
        `Error fetching bids for collection ${collectionId}`,
        error
      );
      throw new InternalServerErrorException(
        'Error fetching bids for collection'
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a collection by ID' })
  @ApiResponse({
    status: 200,
    description: 'The collection has been successfully retrieved.',
    type: Collection,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async findOne(
    @Param('id') id: string,
    @Request() req: { context: IRequestContext }
  ): Promise<CollectionDto> {
    try {
      if (!id || id.trim() === '') {
        throw new NotFoundException('Collection ID is required');
      }

      const collection = await this.collectionService.findOne(
        id,
        req.context.userId
      );

      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }

      return collection;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching collection with ID ${id}`, error);
      throw new InternalServerErrorException('Error fetching collection');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a collection by ID' })
  @ApiResponse({
    status: 200,
    description: 'The collection has been successfully updated.',
    type: Collection,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
    @Request() req: { context: IRequestContext }
  ): Promise<CollectionDto> {
    try {
      if (!id || id.trim() === '') {
        throw new NotFoundException('Collection ID is required');
      }

      if (
        !updateCollectionDto ||
        Object.keys(updateCollectionDto).length === 0
      ) {
        throw new InternalServerErrorException('Update data is required');
      }

      const updatedCollection = await this.collectionService.update(
        id,
        updateCollectionDto,
        req.context.userId
      );

      if (!updatedCollection) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }

      return updatedCollection;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      this.logger.error(`Error updating collection with ID ${id}`, error);
      throw new InternalServerErrorException('Error updating collection');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a collection by ID' })
  @ApiResponse({
    status: 200,
    description: 'The collection has been successfully deleted.',
    type: Collection,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async remove(
    @Param('id') id: string,
    @Request() req: { context: IRequestContext }
  ): Promise<CollectionDto> {
    try {
      if (!id || id.trim() === '') {
        throw new NotFoundException('Collection ID is required');
      }

      const deletedCollection = await this.collectionService.remove(
        id,
        req.context.userId
      );

      if (!deletedCollection) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }

      return deletedCollection;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting collection with ID ${id}`, error);
      throw new InternalServerErrorException('Error deleting collection');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('accept-bid')
  @ApiOperation({ summary: 'Accept a bid for a collection' })
  @ApiResponse({
    status: 200,
    description: 'The bid has been successfully accepted.',
    type: BidDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async acceptBidByCollectionId(
    @Body() acceptBidDto: AcceptBidDto,
    @Request() req: { context: IRequestContext }
  ): Promise<BidDto> {
    try {
      if (
        !acceptBidDto.collectionId ||
        acceptBidDto.collectionId.trim() === ''
      ) {
        throw new NotFoundException('Collection ID is required');
      }

      if (!acceptBidDto.bidId || acceptBidDto.bidId.trim() === '') {
        throw new NotFoundException('Bid ID is required');
      }

      // check if the collection owner is the same as the user who is accepting the bid
      const collection = await this.collectionService.findOne(
        acceptBidDto.collectionId,
        req.context.userId
      );
      if (!collection) {
        throw new NotFoundException('Collection not found');
      }

      // Verify that the current user is the owner of the collection
      if (!collection.isOwner) {
        throw new NotFoundException(
          'You can only accept bids for your own collections'
        );
      }

      const acceptedBid = await this.collectionService.acceptBidByCollectionId(
        acceptBidDto.collectionId,
        acceptBidDto.bidId,
        req.context.userId
      );

      if (!acceptedBid) {
        throw new InternalServerErrorException(
          'Failed to accept bid for collection'
        );
      }

      return acceptedBid;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      this.logger.error(
        `Error accepting bid ${acceptBidDto.bidId} for collection ${acceptBidDto.collectionId}`,
        error
      );
      throw new InternalServerErrorException(
        'Error accepting bid for collection'
      );
    }
  }
}
