import {
    receiveStockService,
    getAvailableImeisService,
    processSaleService
} from "../models/inventoryModel.js";

// Response function
const handleResponse = (res, status, message, data) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const receiveStock = async (req, res, next) => {
    try {
        const { variation_id } = req.params;
        const { location_id, quantity, imeis = [] } = req.body;

        if (!location_id || !quantity) {
            return handleResponse(res, 400, "Location ID and quantity are required to receive stock.", null);
        }

        if (quantity <= 0) {
            return handleResponse(res, 400, "Quantity must be greater than zero.", null);
        }

        const result = await receiveStockService(variation_id, location_id, quantity, imeis);
        
        handleResponse(res, 201, "Stock received successfully", result);
    } catch (error) {
        next(error);
    }
};

export const getAvailableImeis = async (req, res, next) => {
    try {
        const { variation_id } = req.params;
        
        const result = await getAvailableImeisService(variation_id);
        
        handleResponse(res, 200, "Available IMEIs fetched successfully", result);
    } catch (error) {
        next(error);
    }
};

export const processSale = async (req, res, next) => {
    try {
        //PATCH route to /stock/sell, so everything comes from the body
        const { variation_id, location_id, quantity, imeis = [] } = req.body;

        if (!variation_id || !location_id || !quantity) {
            return handleResponse(res, 400, "Variation ID, Location ID, and quantity are required to process a sale.");
        }

        if (quantity <= 0) {
            return handleResponse(res, 400, "Quantity must be greater than zero.");
        }

        const result = await processSaleService(variation_id, location_id, quantity, imeis);
        
        handleResponse(res, 200, "Sale processed successfully", result);
        
    } catch (error) {
        // 23514 is the PostgreSQL error code for a Check Constraint Violation.
        // This stops the stock from dropping below 0 and sends a clean error to the frontend.
        if (error.code === '23514') {
            return handleResponse(
                res, 
                400, 
                "Insufficient stock to complete this sale. Cannot drop below zero."
            );
        }
        next(error);
    }
};