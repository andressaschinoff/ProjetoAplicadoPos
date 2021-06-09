import { NextFunction, Request, Response } from 'express';

export function logRequest(req: Request, _res: Response, next: NextFunction) {
  const { method, originalUrl } = req;
  console.info(method + ': ' + originalUrl);
  return next();
}

export const resLog = (next: NextFunction, err?: Error) => {
  console.log({
    success: !!err ? false : true,
    message: !!err ? err.message : 'OK',
  });
  return next();
};
