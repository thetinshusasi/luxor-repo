import { UserRole } from '../enums/userRole';

interface IRequestContext {
  userId: string;
  email: string;
  role: UserRole;
  tokenId: number;
  exp: Date;
}

export type { IRequestContext };
