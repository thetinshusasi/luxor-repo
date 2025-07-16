import { ApiProperty } from '@nestjs/swagger';
import { BidDto } from '../../bid/dto/bid.dto';

export class CollectionBidListDto {
  @ApiProperty({
    description:
      'The list of bids for the collection based on the collection ID',
    type: [BidDto],
  })
  bids!: BidDto[];

  @ApiProperty({
    description: 'The collection ID',
    type: String,
  })
  collectionId!: string;
}
