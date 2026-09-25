import {
    getBrandsService,
    getBrandByIDService,
    createBrandService,
    updateBrandByIDService,
    deleteBrandByIDService
} from "../models/brandModel.js";

// Response function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const getBrands = async (req, res, next) => {
    try {
        const result = await getBrandsService();
        handleResponse(res, 200, "Brands fetched successfully", result);
    } catch (error) {
        next(error);
    }
};

export const getBrandByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await getBrandByIDService(id);

        if (!result) {
            return handleResponse(res, 404, "Brand not found", null);
        }
        handleResponse(res, 200, "Brand fetched successfully", result);
    } catch (error) {
        next(error);
    }
};

export const createBrand = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return handleResponse(res, 400, "Brand name is required");
        }

        const result = await createBrandService(name);
        handleResponse(res, 201, "Brand created successfully", result);
    } catch (error) {
        next(error);
    }
};

export const updateBrandByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return handleResponse(res, 400, "Brand name is required to update");
        }

        const result = await updateBrandByIDService(id, name);

        if (!result) {
            return handleResponse(res, 404, "Brand not found");
        }
        handleResponse(res, 200, "Brand updated successfully", result);
    } catch (error) {
        next(error);
    }
};

export const deleteBrandByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteBrandByIDService(id);

        if (!result) {
            return handleResponse(res, 404, "Brand not found");
        }
        
        handleResponse(res, 200, "Brand deleted successfully", null);
        
    } catch (error) {
        // Catches the PostgreSQL ON DELETE RESTRICT error
        if (error.code === '23503') {
            return handleResponse(
                res, 
                400, 
                "Cannot delete this brand because there are products tied to it. Please reassign those products first."
            );
        }
        next(error);
    }
};