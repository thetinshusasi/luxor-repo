import { UserRole } from '../enums/userRole';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hashedPassword: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  isAdmin: boolean;
}
