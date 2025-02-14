import { Router, NextFunction, Request, Response } from 'express';
import * as marketController from '../controllers/marketController';
import authenticateJWT from '../middlewares/authMiddleware';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
(req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', authenticateJWT, asyncHandler(marketController.getAllMarkets));
router.post('/', authenticateJWT, asyncHandler(marketController.createMarket));
router.get('/:market_id', authenticateJWT, asyncHandler(marketController.getMarketById));
router.put('/:market_id', authenticateJWT, asyncHandler(marketController.updateMarketById));
router.delete('/:market_id', authenticateJWT, asyncHandler(marketController.deleteMarketById));

export default router;
