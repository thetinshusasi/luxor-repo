import { BidStatus } from './bidStatus';

export interface Bid {
  id: string;
  collectionId: string;
  price: number;
  userId: string;
  status: BidStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isDeleted: boolean;
  isOwner: boolean;
}
