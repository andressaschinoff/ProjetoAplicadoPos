import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import multer from 'multer';
import { resLog } from './Logs';

const storage = multer.diskStorage({
  destination: function (_req, _file, callback) {
    callback(null, path.join(__dirname, '../assets'));
  },
  filename: function (_req, file, callback) {
    const uuid = uuidv4();
    const newname = `${uuid}--${Date.now()}${path.extname(file.originalname)}`;
    callback(null, newname);
  },
});

export const upload = multer({
  storage: storage,
});

export function imageUpload(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      resLog(next);
      return res.status(501).send({
        success: false,
        message: 'This entity don`t accept image files.',
      });
    }
    resLog(next);
    return res.status(200).send({
      success: true,
      message: 'File uploaded!',
      filename: req.file.filename,
    });
  } catch (error) {
    resLog(next);
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
}
