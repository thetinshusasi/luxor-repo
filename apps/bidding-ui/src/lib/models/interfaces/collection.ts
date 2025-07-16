export interface Collection {
  id: string;
  name: string;
  description: string;
  userId: string;
  stock: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isDeleted: boolean;
  isOwner: boolean;
}
