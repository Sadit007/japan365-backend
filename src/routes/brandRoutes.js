import express from "express";

const router = express.Router();


//brands
router.get("/brands", getBrands);
router.get("/brand/:id", getBrandByID);

router.post("/brand", createBrand);
router.put("/brand/:id", updateCategoryByID);

router.delete("/brand/:id", deleteBrandByID);

export default brandRoutes;