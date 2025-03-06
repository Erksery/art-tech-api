export const PRIVACY_VALUES = {
  PRIVATE: 'Private',
  PUBLIC: 'Public',
} as const;

export const STATUS_VALUES = {
  APPROVED: 'approved',
  PENDING: 'pending',
} as const;

export const ROLE_VALUES = {
  USER: 'Admin',
  ADMIN: 'User',
} as const;

export type PrivacyType = (typeof PRIVACY_VALUES)[keyof typeof PRIVACY_VALUES];
export type StatusType = (typeof STATUS_VALUES)[keyof typeof STATUS_VALUES];
export type RoleType = (typeof ROLE_VALUES)[keyof typeof ROLE_VALUES];
