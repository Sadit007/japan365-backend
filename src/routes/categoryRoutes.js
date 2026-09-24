import express from "express";

const router = express.Router();


//categories
router.get("/categories", getCategories);
router.get("/category/:id", getCategoryByID)

router.post("/category", createCategory);
router.put('/category/:id', updateCategoryByID);

export default categoryRoutes;