import { BidStatus } from '../enums/bidStatus';

export interface IBid {
  id: string;
  collectionId: string;
  price: number;
  userId: string;
  status: BidStatus;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  isDeleted: boolean;
}
