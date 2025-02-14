import {
    Request,
    Response
} from 'express';
import prisma from '../models/prismaClient';

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                deleted_at: null,
            },
        });

        return res.status(200).json(categories);
    } catch (err: any) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const {
            name,
            description
        } = req.body;

        const category = await prisma.category.create({
            data: {
                name,
                description,
            },
        });

        return res.status(201).json(category);
    } catch (err: any) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const {
            category_id
        } = req.params;
        const category = await prisma.category.findUnique({
            where: {
                id: category_id
            },
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        return res.status(200).json(category);
    } catch (err: any) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};

export const updateCategoryById = async (req: Request, res: Response) => {
    try {
        const {
            category_id
        } = req.params;
        const {
            name,
            description
        } = req.body;

        const category = await prisma.category.findUnique({
            where: {
                id: category_id
            },
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        const updatedCategory = await prisma.category.update({
            where: {
                id: category_id
            },
            data: {
                name,
                description,
                updated_at: new Date(),
            },
        });

        return res.status(200).json(updatedCategory);
    } catch (err: any) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};

export const deleteCategoryById = async (req: Request, res: Response) => {
    try {
        const {
            category_id
        } = req.params;

        const category = await prisma.category.findUnique({
            where: {
                id: category_id
            },
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        await prisma.category.update({
            where: {
                id: category_id
            },
            data: {
                deleted_at: new Date(),
            },
        });

        return res.status(200).json({
            message: 'Category deleted successfully'
        });
    } catch (err: any) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};