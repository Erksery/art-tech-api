export const PRIVACY_VALUES = {
  PRIVATE: 'Private',
  PUBLIC: 'Public',
} as const;

export const STATUS_VALUES = {
  APPROVED: 'approved',
  PENDING: 'pending',
} as const;

export const ROLE_VALUES = {
  USER: 'User',
  ADMIN: 'Admin',
} as const;

export const SHARING_VALUES = {
  READING: 'Reading',
  EDITING: 'Editing',
} as const;

export const PARAMS_VALUES = {
  FOLDER_ID: 'folderId',
  FILE_ID: 'fileId',
  FILE_NAME: 'fileName',
  USER_ID: 'userId',
};

export const QUERY_VALUES = {
  ORDER: 'order',
  FILTER: 'filter',
  SEARCH: 'searchValue',
  FILENAME: 'fileName',
  LOCATION: 'location',
};

export const LOCATION_VALUER = {
  LOCAL: 'local',
  GLOBAL: 'global',
};

export type PrivacyType = (typeof PRIVACY_VALUES)[keyof typeof PRIVACY_VALUES];
export type StatusType = (typeof STATUS_VALUES)[keyof typeof STATUS_VALUES];
export type RoleType = (typeof ROLE_VALUES)[keyof typeof ROLE_VALUES];
export type SharingType = (typeof SHARING_VALUES)[keyof typeof SHARING_VALUES];
