import { Request } from 'express';
import sharp from 'sharp';
import Busboy from 'busboy';
import { join } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { File } from 'src/models/file.model';
import { writeFile } from 'fs/promises';
import { handleFileUpload } from './fileUpload';

export const uploadFile = async (
  fileModel: typeof File,
  folderId: string,
  req: Request,
  res,
) => {
  try {
    const busboy = Busboy({ headers: req.headers });

    const uploadDir = join(process.cwd(), 'uploads');
    const compressDir = join(process.cwd(), 'compress');

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    if (!existsSync(compressDir)) {
      mkdirSync(compressDir, { recursive: true });
    }

    let fileSize = 0;
    let savedFile: any;
    let originalName = '';
    let fileMimeType = '';
    let fileEncoding = '';
    let uniqueName = '';
    let savePath = '';

    busboy.on('file', (fieldname, file, fileInfo) => {
      originalName = Buffer.from(fileInfo.filename, 'latin1').toString('utf8');
      fileMimeType = fileInfo.mimeType;
      fileEncoding = fileInfo.encoding;

      uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${originalName}`;
      savePath = join(uploadDir, uniqueName);

      const writeStream = createWriteStream(savePath);

      file.on('data', (chunk) => {
        fileSize += chunk.length;
        console.log(`Загружено: ${fileSize} байт`);
      });

      file.on('end', () => {
        console.log(`Файл ${originalName} успешно загружен.`);
      });

      file.on('error', (err) => {
        console.error('Ошибка при записи файла:', err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Ошибка при записи файла',
        });
      });

      file.pipe(writeStream);

      writeStream.on('finish', async () => {
        try {
          if (fileMimeType.startsWith('image/')) {
            const compressedPath = join(compressDir, `${uniqueName}.webp`);
            const compressedImageBuffer = await sharp(savePath)
              .resize({
                width: 600,
                withoutEnlargement: true,
              })
              .webp({ quality: 40 })
              .toBuffer();

            await writeFile(compressedPath, compressedImageBuffer);

            savedFile = await handleFileUpload(
              fileModel,
              folderId,
              uniqueName,
              originalName,
              {
                mimetype: fileMimeType,
                encoding: fileEncoding,
                size: fileSize,
              },
              req.user,
            );
          }

          res.status(HttpStatus.CREATED).json({
            message: 'Файл успешно загружен',
            file: savedFile,
          });
        } catch (err) {
          console.error('Ошибка при загрузке файла', err);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Ошибка при загрузке файла',
          });
        }
      });
    });
    req.pipe(busboy);
  } catch (err) {
    console.log('Ошибка при загрузке файла', err);
    throw new HttpException(
      'Ошибка при загрузке файла',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
