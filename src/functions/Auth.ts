import { NextFunction, Request, Response } from 'express';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (token) {
    const onlyToken = token.slice(7, token.length);
  }
};
