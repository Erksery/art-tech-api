import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { join } from 'path';
import fs from 'fs';
import mime from 'mime-types';

export const findVideoFile = async (req, res, fileName: string) => {
  try {
    const path = join(process.cwd(), 'uploads', fileName);

    console.log(fileName, path);

    if (!fs.existsSync(path)) {
      throw new HttpException('Файл не найден', HttpStatus.NOT_FOUND);
    }

    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    const mimeType = mime.lookup(path) || 'application/octet-stream';

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = Number(parts[0]);
      const end = parts[1] ? Number(parts[1]) : fileSize - 1;

      if (
        Number.isNaN(start) ||
        Number.isNaN(end) ||
        start >= fileSize ||
        start < 0 ||
        end < start ||
        end >= fileSize
      ) {
        console.log(`fileSize = ${fileSize}, range = ${range}`);

        console.log('Invalid range:', { start, end, fileSize });
        res.writeHead(416, {
          'Content-Range': `bytes */${fileSize}`,
        });
        return res.end();
      }

      const chunkSize = end - start + 1;
      const file = fs.createReadStream(path, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
        'Cache-Control': 'no-store',
      });

      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
        'Cache-Control': 'no-store',
      });

      fs.createReadStream(path).pipe(res);
    }
  } catch (err) {
    if (err instanceof ConflictException) {
      throw err;
    }

    console.error('Ошибка при получении видео', err);
    throw new HttpException(
      'Ошибка при получении видео',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
