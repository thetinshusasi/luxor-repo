export interface IUser {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  isAdmin: boolean;
}
