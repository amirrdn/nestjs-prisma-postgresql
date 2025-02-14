import { Router, NextFunction, Request, Response } from 'express';
import * as categoriesController from '../controllers/categoriesController';
import authenticateJWT from '../middlewares/authMiddleware';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
(req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', authenticateJWT, asyncHandler(categoriesController.getAllCategories));
router.post('/', authenticateJWT, asyncHandler(categoriesController.createCategory));
router.get('/:category_id', authenticateJWT, asyncHandler(categoriesController.getCategoryById));
router.put('/:category_id', authenticateJWT, asyncHandler(categoriesController.updateCategoryById));
router.delete('/:category_id', authenticateJWT, asyncHandler(categoriesController.deleteCategoryById));

export default router;