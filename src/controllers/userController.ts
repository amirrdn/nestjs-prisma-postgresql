import {
  Request,
  Response
} from 'express';
import * as userService from '../services/userService';
import * as bcrypt from 'bcrypt';
import {
  PrismaClient,
  Role as PrismaRole
} from '@prisma/client';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      full_name,
      role
    } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      },
    });

    if (existingUser) {
      throw new Error('Email sudah terdaftar');
    }

    const user = await userService.createUser(email, password, full_name, role);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password
    } = req.body;
    const {
      accessToken,
      refreshToken,
      user
    } = await userService.loginUser(email, password);
    let session = await prisma.session.findUnique({
      where: {
        refresh_token: refreshToken
      },
    });
    if (!session) {
      session = await prisma.session.create({
        data: {
          user_id: user.id,
          refresh_token: refreshToken,
          expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30), // expired 30 day
          created_at: new Date(),
        },
      });
    } else {
      session = await prisma.session.update({
        where: {
          refresh_token: refreshToken
        },
        data: {
          expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30), // expired 30 day
          updated_at: new Date(),
        },
      });
    }
    res.json({
      accessToken,
      refreshToken,
      user
    });
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

export const createUser = async (email: string, password: string, full_name: string, role: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email
    },
  });

  if (existingUser) {
    throw new Error('Email sudah terdaftar');
  }

  const validRoles: PrismaRole[] = [PrismaRole.admin, PrismaRole.customer, PrismaRole.seller];

  if (!validRoles.includes(role as PrismaRole)) {
    throw new Error('Role tidak valid');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      full_name,
      role: role as PrismaRole,
    },
  });
  return user;
};
export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const {
      role
    } = req.query;

    let users;
    if (role) {
      users = await prisma.user.findMany({
        where: {
          role: role as PrismaRole,
        },
      });
    } else {
      users = await prisma.user.findMany();
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};
export const registerAdminUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      full_name,
      role
    } = req.body;

    if (role !== 'admin') {
      return res.status(400).json({
        message: 'Only admin role is allowed'
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        full_name,
        role: 'admin', // only admin
      },
    });

    return res.status(201).json(user);
  } catch (err: any) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const {
      user_id
    } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: user_id
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.status(200).json(user);
  } catch (err: any) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const {
      user_id
    } = req.params;
    const {
      email,
      full_name,
      gender,
      birthday,
      role,
      is_enabled,
      password
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: user_id
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    let hashedPassword = existingUser.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user_id
      },
      data: {
        email: email || existingUser.email,
        full_name: full_name || existingUser.full_name,
        gender: gender || existingUser.gender,
        birthday: birthday || existingUser.birthday,
        role: role || existingUser.role,
        is_enabled: is_enabled !== undefined ? is_enabled : existingUser.is_enabled,
        password: hashedPassword,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (err: any) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const {
      user_id
    } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: user_id
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    await prisma.user.delete({
      where: {
        id: user_id
      },
    });

    return res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};