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


export const getAllProducts = async (req: CustomRequest, res: Response) => {
    try {
        const {
            category_id
        } = req.query;
        const products = await prisma.product.findMany({
            where: {
                category_id: category_id ? String(category_id) : undefined,
                deleted_at: null,
            },
        });
        return res.status(200).json(products);
    } catch (err: any) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};

export const createProduct = async (req: CustomRequest, res: Response) => {
    try {
        const {
            market_id,
            category_id,
            name,
            description,
            price,
            stock
        } = req.body;
        const userRole = req.user?.role;
        if (userRole !== 'seller') {
            return res.status(403).json({
                message: 'Access forbidden: Only sellers can create products.'
            });
        }

        const userId = req.user?.id; //from jwt
        if (!userId) {
            return res.status(400).json({
                message: 'User ID is required'
            });
        }

        const category = await prisma.category.findUnique({
            where: {
                id: String(category_id)
            },
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        const product = await prisma.product.create({
            data: {
                market_id,
                category_id,
                name,
                description,
                price,
                stock,
            },
        });

        return res.status(201).json(product);
    } catch (err: any) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};

export const getProductById = async (req: CustomRequest, res: Response) => {
    try {
        const {
            product_id
        } = req.params;
        const product = await prisma.product.findUnique({
            where: {
                id: product_id
            },
        });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        return res.status(200).json(product);
    } catch (err: any) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};

export const updateProductById = async (req: CustomRequest, res: Response) => {
    try {
        const {
            product_id
        } = req.params;
        const {
            name,
            description,
            price,
            stock,
            category_id
        } = req.body;

        const product = await prisma.product.findUnique({
            where: {
                id: product_id
            },
        });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        const category = await prisma.category.findUnique({
            where: {
                id: String(category_id)
            },
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        const updatedProduct = await prisma.product.update({
            where: {
                id: product_id
            },
            data: {
                name,
                description,
                price,
                stock,
                category_id,
                updated_at: new Date(),
            },
        });

        return res.status(200).json(updatedProduct);
    } catch (err: any) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};

export const deleteProductById = async (req: CustomRequest, res: Response) => {
    try {
        const {
            product_id
        } = req.params;

        const product = await prisma.product.findUnique({
            where: {
                id: product_id
            },
        });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        await prisma.product.delete({
            where: {
                id: product_id
            },
        });

        return res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (err: any) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};