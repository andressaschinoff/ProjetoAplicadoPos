import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import multer from 'multer';
import { responseLog } from './Logs';

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

export function imageUpload(req: Request, res: Response) {
  try {
    if (!req.file) {
      responseLog();
      return res.status(501).send({
        success: false,
        message: 'This entity don`t accept image files.',
      });
    }
    responseLog();
    return res.status(200).send({
      success: true,
      message: 'File uploaded!',
      filename: req.file.filename,
    });
  } catch (error) {
    responseLog(error);
    return res.status(400).json({ error: error.message });
  }
}
