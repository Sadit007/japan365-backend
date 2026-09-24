//response function

import { addProductService, deleteProductByIDService, getAllProductsService, getProductByID, addProductVeriationService, deleteVeriationService } from "../models/productModel";

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
        const id = await req.params.id;
        const product = await getProductByID(id);

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
        const {id}= req.params.id;
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
        const{id} = req.params.id;
        const result = await deleteProductByIDService(id);
        if(!result){
            return handleResponse(res, 404, "product not found", null);
        }
        handleResponse(res, 204, "Product Deleted Successfully", null)
    }catch(error){
        next(error);
    }
}

export const deleteVeriationByID = async(veriationID)=>{
    try{
        const{veriationID} = req.params.veriationID;
        const result = await deleteVeriationService(id);
        
        if(!result){
            return handleResponse(res, 404, "veriant not found", null);
        }
        handleResponse(res, 204, "Veriant Deleted Successfully", null)

    }catch(error){
        next(error);
    }
}