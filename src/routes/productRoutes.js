import express from "express";

const router = express.Router();

//products and veriations
router.get("/products", getAllProducts);
router.get("/product/:id", getProductByID);

router.post("/product", addProduct);
router.post("/product/:id/veriations", addProductVeriation);

router.put("/veriations/:veriation_id", updateVeriationByID);

router.delete('/products/:id', deleteProductByID);
router.delete('/veriations/:veriation_id', deleteVeriation);


export default productRoutes;