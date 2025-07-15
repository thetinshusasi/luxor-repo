import { UserRole } from '../enums/userRole';

interface ITokenPayload {
  tokenId: string;
  email: string;
  token: string;
  role: UserRole;
  expiresAt: Date;
}

export type { ITokenPayload };
