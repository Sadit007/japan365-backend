import pool from "../config/db";

import express from "express";

const router = express.Router();

//products and veriations
router.get("/products", getAllProducts);
router.get("/product/:id", getProductByID);

router.post("/product", addProduct);
router.post("/product/:id/variations", addProductVeriation);

router.put("/variations/:variation_id", updateVariationByID);

router.delete('/products/:id', deleteProductByID);
router.delete('/variations/:variation_id', deleteVariation);


export default productRoutes;