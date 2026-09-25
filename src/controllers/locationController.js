import {
    getLocationsService,
    getLocationByIDService,
    createLocationService,
    updateLocationByIDService,
    deleteLocationByIDService
} from "../models/locationModel.js";

// Response function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const getLocations = async (req, res, next) => {
    try {
        const result = await getLocationsService();
        handleResponse(res, 200, "Locations fetched successfully", result);
    } catch (error) {
        next(error);
    }
};

export const getLocationByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await getLocationByIDService(id);

        if (!result) {
            return handleResponse(res, 404, "Location not found", null);
        }
        handleResponse(res, 200, "Location fetched successfully", result);
    } catch (error) {
        next(error);
    }
};

export const createLocation = async (req, res, next) => {
    try {
        const { name, address } = req.body;

        if (!name) {
            return handleResponse(res, 400, "Location name is required");
        }

        const result = await createLocationService(name, address);
        handleResponse(res, 201, "Location created successfully", result);
    } catch (error) {
        next(error);
    }
};

export const updateLocationByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, address } = req.body;

        if (!name && !address) {
            return handleResponse(res, 400, "At least one field (name or address) is required to update");
        }

        const result = await updateLocationByIDService(id, name, address);

        if (!result) {
            return handleResponse(res, 404, "Location not found");
        }
        handleResponse(res, 200, "Location updated successfully", result);
    } catch (error) {
        next(error);
    }
};

export const deleteLocationByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteLocationByIDService(id);

        if (!result) {
            return handleResponse(res, 404, "Location not found");
        }
        
        handleResponse(res, 200, "Location deleted successfully", null);
        
    } catch (error) {
        //PostgreSQL ON DELETE RESTRICT error for the location_stock table
        if (error.code === '23503') {
            return handleResponse(
                res, 
                400, 
                "Cannot delete this location because it contains active inventory stock. Please transfer or remove the stock first."
            );
        }
        next(error);
    }
};