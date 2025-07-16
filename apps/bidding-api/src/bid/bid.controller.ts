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
  BadRequestException,
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
import { UUID_REGEX } from '../common/utils/constants';

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
    // Get userId from request context
    const { userId } = req.context;
    if (!userId) {
      throw new BadRequestException('User ID not found in request context');
    }

    // Set userId from context
    createBidDto.userId = userId;

    return await this.bidService.create(createBidDto);
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
    // Get userId from request context
    const userId = req.context?.userId;
    if (!userId) {
      throw new BadRequestException('User ID not found in request context');
    }

    // Convert pagination parameters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    return await this.bidService.findAll(pageNum, limitNum, userId);
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
    // Basic UUID validation
    if (!UUID_REGEX.test(id)) {
      throw new BadRequestException('Invalid bid ID format');
    }

    // Get userId from request context
    const userId = req.context?.userId;
    if (!userId) {
      throw new BadRequestException('User ID not found in request context');
    }

    return await this.bidService.findOne(id, userId);
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
    // Basic UUID validation
    if (!UUID_REGEX.test(id)) {
      throw new BadRequestException('Invalid bid ID format');
    }

    // Get userId from request context
    const { userId } = req.context;
    if (!userId) {
      throw new BadRequestException('User ID not found in request context');
    }

    return await this.bidService.update(id, updateBidDto, userId);
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
    // Basic UUID validation
    if (!UUID_REGEX.test(id)) {
      throw new BadRequestException('Invalid bid ID format');
    }

    // Get userId from request context
    const { userId } = req.context;
    if (!userId) {
      throw new BadRequestException('User ID not found in request context');
    }

    return await this.bidService.remove(id, userId);
  }
}
