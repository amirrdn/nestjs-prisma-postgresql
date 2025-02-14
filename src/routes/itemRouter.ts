import { Router, NextFunction, Request, Response } from 'express';
import * as prodController from '../controllers/productController';
import authenticateJWT from '../middlewares/authMiddleware';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
(req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', authenticateJWT, asyncHandler(prodController.getAllProducts));
router.post('/', authenticateJWT, asyncHandler(prodController.createProduct));
router.get('/:product_id', authenticateJWT, asyncHandler(prodController.getProductById));
router.put('/:product_id', authenticateJWT, asyncHandler(prodController.updateProductById));
router.delete('/:product_id', authenticateJWT, asyncHandler(prodController.deleteProductById));

export default router;