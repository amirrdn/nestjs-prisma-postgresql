import { Router, NextFunction, Request, Response } from 'express';
import * as userController from '../controllers/userController';
import authenticateJWT from '../middlewares/authMiddleware';
import * as sessionController from '../controllers/sessionController';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
    (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);


router.post('/logout', asyncHandler(sessionController.logoutUserSession));
router.post('/logout-all', asyncHandler(sessionController.logoutAllUserSessions));
router.get('/session', authenticateJWT, asyncHandler(sessionController.getUserSessions));

router.get('/', authenticateJWT, asyncHandler(userController.getUsersByRole));
router.post('/', authenticateJWT, asyncHandler(userController.registerAdminUser));
router.get('/:user_id', authenticateJWT, asyncHandler(userController.getUserById));
router.put('/:user_id', authenticateJWT, asyncHandler(userController.updateUserById));
router.delete('/:user_id', authenticateJWT, asyncHandler(userController.deleteUserById));

export default router;
