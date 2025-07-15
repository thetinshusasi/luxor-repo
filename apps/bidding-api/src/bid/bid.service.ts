import { Injectable } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Bid } from './entities/bid.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>
  ) {}

  create(createBidDto: CreateBidDto) {
    return this.bidRepository.save(createBidDto);
  }

  findAll(page: number, limit: number) {
    return this.bidRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOne(id: string) {
    return this.bidRepository.findOne({ where: { id } });
  }

  update(id: string, updateBidDto: UpdateBidDto) {
    return this.bidRepository.update(id, updateBidDto);
  }

  remove(id: string) {
    return this.bidRepository.update(id, {
      isDeleted: true,
    });
  }
}
