import {
  Request,
  Response
} from 'express';
import prisma from '../models/prismaClient';
import {
  Gender,
  Role
} from '@prisma/client';

interface CustomRequest extends Request {
  user ? : {
    id: string;
    email: string;
    password: string;
    full_name: string | null;
    gender: Gender | null;
    birthday: string | null;
    role: Role;
    is_enabled: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
  };
}

const isAdmin = (role: string) => role === 'admin';

export const getAllMarkets = async (req: CustomRequest, res: Response) => {
  try {
    const userRole = req.user?.role || ''; //from jwt
    if (!isAdmin(userRole)) {
      return res.status(403).json({
        message: 'Access forbidden: Only admins can access markets.'
      });
    }

    const markets = await prisma.market.findMany();
    return res.status(200).json(markets);
  } catch (err: any) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};

export const createMarket = async (req: CustomRequest, res: Response) => {
  try {
    const {
      name,
      description
    } = req.body;
    const userRole = req.user?.role; // fom jwt
    if (userRole !== 'seller') {
      return res.status(403).json({
        message: 'Access forbidden: Only sellers can create markets.'
      });
    }

    const userId = req.user?.id; // from jwt
    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      });
    }

    const market = await prisma.market.create({
      data: {
        user_id: userId,
        name,
        description,
      },
    });
    return res.status(201).json(market);
  } catch (err: any) {
    return res.status(500).send('Internal Server Error');
  }
};

export const getMarketById = async (req: CustomRequest, res: Response) => {
  try {
    const {
      market_id
    } = req.params;
    const market = await prisma.market.findUnique({
      where: {
        id: market_id
      },
    });

    if (!market) {
      return res.status(404).json({
        message: 'Market not found'
      });
    }

    return res.status(200).json(market);
  } catch (err: any) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};

export const updateMarketById = async (req: CustomRequest, res: Response) => {
  try {
    const {
      market_id
    } = req.params;
    const {
      name,
      description
    } = req.body;

    const market = await prisma.market.findUnique({
      where: {
        id: market_id
      },
    });

    if (!market) {
      return res.status(404).json({
        message: 'Market not found'
      });
    }

    const updatedMarket = await prisma.market.update({
      where: {
        id: market_id
      },
      data: {
        name,
        description,
        updated_at: new Date(),
      },
    });

    return res.status(200).json(updatedMarket);
  } catch (err: any) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};

export const deleteMarketById = async (req: CustomRequest, res: Response) => {
  try {
    const {
      market_id
    } = req.params;

    const market = await prisma.market.findUnique({
      where: {
        id: market_id
      },
    });

    if (!market) {
      return res.status(404).json({
        message: 'Market not found'
      });
    }

    await prisma.market.delete({
      where: {
        id: market_id
      },
    });

    return res.status(200).json({
      message: 'Market deleted successfully'
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};