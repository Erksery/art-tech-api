export const SITE_CONTROLLER = { FILE: 'files', UPLOAD: 'upload' } as const;

export const SITE_ROUTES = {
  FIND_ALL: 'folder/:folderId',
  FIND_ONE: 'folder/:folderId/file/:fileId',
  GET_IMAGE: 'image/:fileId',
  DOWNLOAD: 'download/:fileId',
  EDIT: 'folder/:folderId/file/:fileId',
  DELETE: 'folder/:folderId/file/:fileId',

  UPLOAD: ':folderId',
} as const;
