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
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Bid } from './entities/bid.entity';
import { ContextExtractInterceptor } from '../interceptors/context-extract/context-extract.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BidDto } from './dto/bid.dto';
import { IRequestContext } from '../models/interfaces/request-context';

@ApiTags('Bids')
@ApiBearerAuth('access-token')
@UseInterceptors(ContextExtractInterceptor)
@Controller('bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new bid' })
  @ApiResponse({
    status: 201,
    description: 'The bid has been successfully created.',
    type: Bid,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async create(
    @Body() createBidDto: CreateBidDto,
    @Request() req: { context: IRequestContext }
  ): Promise<BidDto> {
    try {
      // Validate input data
      if (!createBidDto) {
        throw new BadRequestException('Request body is required');
      }

      if (
        !createBidDto.collectionId ||
        createBidDto.collectionId.trim() === ''
      ) {
        throw new BadRequestException('Collection ID is required');
      }

      if (!createBidDto.price || createBidDto.price <= 0) {
        throw new BadRequestException('Valid price is required');
      }

      // Get userId from request context
      const { userId } = req.context;
      if (!userId) {
        throw new BadRequestException('User ID not found in request context');
      }

      // Set userId from context
      createBidDto.userId = userId;

      const result = await this.bidService.create(createBidDto);

      if (!result) {
        throw new HttpException(
          'Failed to create bid',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return result;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof HttpException
      ) {
        throw error;
      }
      throw new HttpException(
        'Failed to create bid',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all bids with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'The bids have been successfully retrieved.',
    type: [Bid],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid pagination parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Request() req: { context: IRequestContext }
  ) {
    try {
      // Validate and convert pagination parameters
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      if (isNaN(pageNum) || pageNum < 1) {
        throw new BadRequestException('Page must be a positive integer');
      }

      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new BadRequestException('Limit must be between 1 and 100');
      }

      // Get userId from request context
      const userId = req.context?.userId;
      if (!userId) {
        throw new BadRequestException('User ID not found in request context');
      }

      const result = await this.bidService.findAll(pageNum, limitNum, userId);

      if (!result) {
        return [];
      }

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve bids',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a bid by ID' })
  @ApiResponse({
    status: 200,
    description: 'The bid has been successfully retrieved.',
    type: Bid,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Bid not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async findOne(
    @Param('id') id: string,
    @Request() req: { context: IRequestContext }
  ): Promise<BidDto> {
    try {
      // Validate ID parameter
      if (!id || id.trim() === '') {
        throw new BadRequestException('Bid ID is required');
      }

      // Basic UUID validation
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new BadRequestException('Invalid bid ID format');
      }

      // Get userId from request context
      const userId = req.context?.userId;
      if (!userId) {
        throw new BadRequestException('User ID not found in request context');
      }

      const result = await this.bidService.findOne(id, userId);

      if (!result) {
        throw new NotFoundException(`Bid with ID ${id} not found`);
      }

      return result;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve bid',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a bid by ID' })
  @ApiResponse({
    status: 200,
    description: 'The bid has been successfully updated.',
    type: Bid,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Bid not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async update(
    @Param('id') id: string,
    @Body() updateBidDto: UpdateBidDto,
    @Request() req: { context: IRequestContext }
  ): Promise<BidDto> {
    try {
      // Validate ID parameter
      if (!id || id.trim() === '') {
        throw new BadRequestException('Bid ID is required');
      }

      // Basic UUID validation
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new BadRequestException('Invalid bid ID format');
      }

      // Validate request body
      if (!updateBidDto || Object.keys(updateBidDto).length === 0) {
        throw new BadRequestException('Update data is required');
      }

      // Validate individual fields if provided
      if (
        updateBidDto.collectionId !== undefined &&
        (!updateBidDto.collectionId || updateBidDto.collectionId.trim() === '')
      ) {
        throw new BadRequestException('Collection ID cannot be empty');
      }

      if (
        updateBidDto.price !== undefined &&
        (!updateBidDto.price || updateBidDto.price <= 0)
      ) {
        throw new BadRequestException('Price must be positive');
      }

      // Get userId from request context
      const { userId } = req.context;
      if (!userId) {
        throw new BadRequestException('User ID not found in request context');
      }

      // Check if bid exists before updating
      const existingBid = await this.bidService.findOne(id, userId);
      if (!existingBid) {
        throw new NotFoundException(`Bid with ID ${id} not found`);
      }

      const result = await this.bidService.update(id, updateBidDto, userId);

      return result;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof HttpException
      ) {
        throw error;
      }
      throw new HttpException(
        'Failed to update bid',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a bid by ID (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'The bid has been successfully deleted.',
    type: Bid,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Bid not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async remove(
    @Param('id') id: string,
    @Request() req: { context: IRequestContext }
  ): Promise<BidDto> {
    try {
      // Validate ID parameter
      if (!id || id.trim() === '') {
        throw new BadRequestException('Bid ID is required');
      }

      // Basic UUID validation
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new BadRequestException('Invalid bid ID format');
      }

      // Get userId from request context
      const { userId } = req.context;
      if (!userId) {
        throw new BadRequestException('User ID not found in request context');
      }

      // Check if bid exists before deleting
      const existingBid = await this.bidService.findOne(id, userId);
      if (!existingBid) {
        throw new NotFoundException(`Bid with ID ${id} not found`);
      }

      const result = await this.bidService.remove(id, userId);

      return result;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof HttpException
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
