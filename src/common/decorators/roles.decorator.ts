import { SetMetadata } from '@nestjs/common';

export enum Role {
  ADMIN = 'admin',
  STORE_OWNER = 'store_owner',
  STORE_EMPLOYEE = 'store_employee',
  CUSTOMER = 'customer',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
