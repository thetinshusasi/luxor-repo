import { BidStatus } from './bidStatus';

export interface CollectionBid {
  id: string;
  collectionId: string;
  isOwner: boolean;
  price: number;
  status: BidStatus;
}
