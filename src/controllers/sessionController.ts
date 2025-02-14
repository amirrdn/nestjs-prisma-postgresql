import {
  Request,
  Response
} from 'express';
import prisma from '../models/prismaClient';

export const logoutUserSession = async (req: Request, res: Response) => {
  try {
    const {
      refresh_token
    } = req.body;

    if (!refresh_token) {
      return res.status(400).send('Refresh token is required');
    }

    await prisma.session.delete({
      where: {
        refresh_token: refresh_token,
      },
    });

    return res.status(200).send('Session deleted successfully');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

export const logoutAllUserSessions = async (req: Request, res: Response) => {
  try {
    const {
      refresh_token
    } = req.body;

    if (!refresh_token) {
      return res.status(400).send('Refresh token is required');
    }

    await prisma.session.deleteMany({
      where: {
        refresh_token: refresh_token,
      },
    });

    return res.status(200).send('All sessions deleted successfully');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

export const getUserSessions = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string | undefined;

    if (!userId) {
      const sessions = await prisma.session.findMany();
      return res.status(200).json(sessions);
    } else {
      const sessions = await prisma.session.findMany({
        where: {
          user_id: userId as string,
        },
      });
      return res.status(200).json(sessions);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};