import { 
    getCategoriesService,
    getCategoryByIDService,
    createCategoryService,
    updateCategoryByIDService,
    deleteCategoryByIDService,
    getSubCategoriesByIDService,
    addSubcategoryByIDService
} from "../models/categoryModel.js";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const getCategories = async (req, res, next) => {
    try {
        const result = await getCategoriesService();
        handleResponse(res, 200, "Categories fetched successfully", result);
    } catch (error) {
        next(error);
    }
};

export const getCategoryByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await getCategoryByIDService(id);

        if (!result) {
            return handleResponse(res, 404, "Category not found");
        }
        handleResponse(res, 200, "Category Fetched Successfully", result);
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return handleResponse(res, 400, "Category Name is required");
        }

        const result = await createCategoryService(name);
        handleResponse(res, 201, "Category Created Successfully", result);
    } catch (error) {
        next(error);
    }
};

export const updateCategoryByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, parentID } = req.body;

        const result = await updateCategoryByIDService(id, name, parentID);

        if (!result) {
            return handleResponse(res, 404, "Category not found");
        }
        handleResponse(res, 200, "Category Updated Successfully", result);
    } catch (error) {
        next(error);
    }
};

export const deleteCategoryByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteCategoryByIDService(id);

        if (!result) {
            return handleResponse(res, 404, "Category not found");
        }
        handleResponse(res, 200, "Category Deleted Successfully", null);
        
    } catch (error) {
        // This catches the PostgreSQL ON DELETE RESTRICT error
        if (error.code === '23503') {
            return handleResponse(
                res, 
                400, 
                "Cannot delete this category because it contains active subcategories or products. Please reassign them first."
            );
        }
        next(error);
    }
};

export const getSubCategoriesByID = async (req, res, next) => {
    try {
        const { id } = req.params; // This is the parent's ID from the URL
        const result = await getSubCategoriesByIDService(id);
        
        handleResponse(res, 200, "Subcategories Fetched Successfully", result);
    } catch (error) {
        next(error);
    }
};

export const addSubcategoryByID = async (req, res, next) => {
    try {
        const { id } = req.params; // This is the parent's ID from the URL
        const { name } = req.body;

        if (!name) {
            return handleResponse(res, 400, "Subcategory Name is required");
        }

        const result = await addSubcategoryByIDService(id, name);
        handleResponse(res, 201, "Subcategory Created Successfully", result);
    } catch (error) {
        next(error);
    }
};