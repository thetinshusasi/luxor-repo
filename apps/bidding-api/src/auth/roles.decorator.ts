import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../models/enums/userRole';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
