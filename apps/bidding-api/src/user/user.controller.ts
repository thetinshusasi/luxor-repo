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
  Request,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ContextExtractInterceptor } from '../interceptors/context-extract/context-extract.interceptor';
import { User } from './entities/user.entity';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../models/enums/userRole';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IRequestContext } from '../models/interfaces/request-context';
import { Request as ExpressRequest } from 'express';
import { Logger } from 'nestjs-pino';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseInterceptors(ContextExtractInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'The users have been successfully retrieved.',
    type: [User],
  })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.userService.findAll(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: User,
  })
  async getProfile(
    @Request() req: ExpressRequest & { context: IRequestContext }
  ) {
    try {
      const context: IRequestContext = req.context;
      this.logger.debug(`Fetching profile for user ID: ${context.userId}`);
      const user = await this.userService.findOne(context.userId);
      return user;
    } catch (error) {
      this.logger.error('Error fetching profile', error);
      throw new InternalServerErrorException('Error fetching profile');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('details')
  @ApiOperation({ summary: 'Get user details' })
  @ApiResponse({
    status: 200,
    description: 'User details retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getUserDetails(@Request() req: { context: IRequestContext }) {
    const { userId } = req.context;
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.userService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundException,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to retrieve',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  async findOne(@Param('id') id: string) {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('User ID is required');
      }

      const user = await this.userService.findOne(id);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching user with ID ${id}`, error);
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundException,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('User ID is required');
      }

      if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
        throw new BadRequestException('Update data is required');
      }

      const updatedUser = await this.userService.update(id, updateUserDto);

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return updatedUser;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      this.logger.error(`Error updating user with ID ${id}`, error);
      throw new InternalServerErrorException('Error updating user');
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundException,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  async remove(@Param('id') id: string) {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('User ID is required');
      }

      const deletedUser = await this.userService.update(id, {
        isDeleted: true,
        isActive: false,
      });

      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return deletedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting user with ID ${id}`, error);
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
