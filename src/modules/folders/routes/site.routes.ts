export const SITE_CONTROLLER = { FOLDER: 'folders' } as const;

export const SITE_ROUTES = {
  GET: '/',
  CREATE: '/',
  EDIT: '/:folderId',
  DELETE: '/:folderId',
} as const;
