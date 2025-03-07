import { Folders } from 'src/models/folders.model';
import { findAccessFolders } from './scripts/findAccessFolders';

export const getFolders = async (folderModel: typeof Folders, user) => {
  try {
    const folder = await findAccessFolders(folderModel, user);
    return folder;
  } catch (err) {
    console.error('Ошибка при получении папок', err);
  }
};
