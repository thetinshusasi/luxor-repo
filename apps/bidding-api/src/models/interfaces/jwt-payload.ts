import { UserRole } from '../enums/userRole';

interface IJwtPayload {
  email: string;
  role: UserRole;
  sub: string;
}

export type { IJwtPayload };
