import { Bid } from '../../bid/entities/bid.entity';
import { BidDto } from '../../bid/dto/bid.dto';

export const convertBidEntityToBidDto = (bid: Bid , userId: string): BidDto => {
  const isOwner = bid.userId === userId;
  return {
    id: bid.id,
    collectionId: bid.collectionId,
    isOwner: isOwner,
    price: bid.price,
    status: bid.status,
  };
};