export interface ICollection {
  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  isDeleted: boolean;
}
