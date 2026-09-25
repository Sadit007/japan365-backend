import express from "express";
import { getAllProducts, getProductByID, addProduct, addProductVariation, deleteProductByID, deleteVeriationByID} from "../controllers/productController.js";

const router = express.Router();

//products and veriations
router.get("/products", getAllProducts);
router.get("/products/:id", getProductByID);

router.post("/products", addProduct);
router.post("/products/:id/variations", addProductVariation);

// router.put("/veriations/:veriation_id", updateVeriationByID);

router.delete('/products/:id', deleteProductByID);
router.delete('/variations/:variation_id', deleteVeriationByID);


export default router;