export const SITE_CONTROLLER = { FILE: 'files', UPLOAD: 'upload' } as const;
export const PUBLIC_SITE_CONTROLLER = {
  FILE: 'public',
  UPLOAD: 'upload',
} as const;

export const SITE_ROUTES = {
  FIND_ALL: 'folder/:folderId',
  DOWNLOAD: 'download/folder/:folderId',
  FIND_ONE: 'folder/:folderId/file/:fileId',
  SEARCH_ALL_FILES: 'searchAllFiles/:folderId',
  GET_IMAGE: 'image/folder/:folderId/file/:fileName',
  GET_COMPRESSED_IMAGE: 'compress_image/folder/:folderId/file/:fileName',
  EDIT: 'folder/:folderId/file/:fileId',
  DELETE: 'folder/:folderId/file/:fileId',

  UPLOAD: ':folderId',
} as const;
