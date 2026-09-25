import express from "express";
import { 
    getBrands, 
    getBrandByID,
    createBrand,
    updateBrandByID,
    deleteBrandByID 
} from "../controllers/brandController.js";

const router = express.Router();

//brands
router.get("/brands", getBrands);
router.get("/brands/:id", getBrandByID);

router.post("/brands", createBrand);
router.put("/brands/:id", updateBrandByID); 
router.delete("/brands/:id", deleteBrandByID);

export default router;