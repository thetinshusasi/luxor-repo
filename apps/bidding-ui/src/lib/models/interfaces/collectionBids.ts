import { CollectionBid } from '@/lib/hooks/useApi';

export interface CollectionBids {
  collectionId: string;
  bids: CollectionBid[];
}
