import {
  Request,
  Response,
  NextFunction
} from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user ? : any;
}

const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    res.status(403).send('Access denied.');
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      res.status(403).send('Invalid token');
      return;
    }
    req.user = {
      id: user.userId,
      ...user
    };
    next();
  });
};

export default authenticateJWT;