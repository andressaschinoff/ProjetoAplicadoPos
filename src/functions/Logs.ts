import { NextFunction, Request, Response } from 'express';

export function logRequest(req: Request, _res: Response, next: NextFunction) {
  const { method, originalUrl } = req;
  console.info(method + ': ' + originalUrl);
  return next();
}

export const responseLog = (err?: Error | any, entity?: any) => {
  console.log({
    success: !!err ? false : true,
    message: !!err ? err.message : 'OK',
    entity: entity,
  });
};
