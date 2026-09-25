//response function

import { addProductService, deleteProductByIDService, getAllProductsService, addProductVeriationService, deleteVeriationService, getProductByIDService } from "../models/productModel.js";

const handleResponse = (res, status, message, data)=>{
    res.status(status).json({
        status,
        message,
        data,
    })
};

export const getAllProducts = async(req, res, next)=>{
    try{
        const result = await getAllProductsService();
        handleResponse(res, 200, "Users Fetched Successfully", result);
    }catch(error){
        next(error);
    }
};

export const getProductByID = async(req, res, next) =>{
     try{
        const {id} = req.params;
        const product = await getProductByIDService(id);

        if(!product){
            return handleResponse(res, 404, "product not found");
        }
        handleResponse(res, 200, "Product Fetched Successfully", product)
     }catch(error){
        next(error);
     }
};

export const addProduct = async(req, res, next) =>{
    try{
        const{product, veriations = []} = req.body;

        if(!product || !product.name){
            return handleResponse(res, 400, "Product Name is required", null);
        }

        if(!Array.isArray(veriations)){
            return(res, 400, "Variations must be an array", null);
        }

        const result = await addProductService(product, veriations);
        handleResponse(res, 201, "Product Created Successfully", result);
    }catch(error){
        next(error);
    }
};

export const addProductVeriation = async(req, res, next) =>{
    try{
        const {id}= req.params;
        const {veriation} = req.body;

        if(!veriation){
            return handleResponse(res, 400, "Veriation Required", null);
        }

        const result = await addProductVeriationService(id, veriation);
        handleResponse(res, 201, "veration added successfully", result);
    }catch(error){
        next(error);
    }
};

export const deleteProductByID = async(req, res, next) =>{
    try{
        const{id} = req.params;
        const result = await deleteProductByIDService(id);
        if(!result){
            return handleResponse(res, 404, "product not found", null);
        }
        handleResponse(res, 200, "Product Deleted Successfully", null)
    }catch(error){
        next(error);
    }
}

export const deleteVeriationByID = async(req, res, next)=>{
    try{
        const{veriationID} = req.params;
        const result = await deleteVeriationService(veriationID);
        
        if(!result){
            return handleResponse(res, 404, "veriant not found", null);
        }
        handleResponse(res, 200, "Veriant Deleted Successfully", null)

    }catch(error){
        next(error);
    }
}