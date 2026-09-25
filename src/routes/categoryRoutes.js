import express from "express";
import { 
    getCategories,
    createCategory,
    updateCategoryByID,
    getCategoryByID,
    deleteCategoryByID,
    getSubCategoriesByID,
    addSubcategoryByID

} from "../controllers/categoryController.js";

const router = express.Router();



// MAIN CATEGORIES
router.get("/categories", getCategories);
router.post("/categories", createCategory);

// SINGLE CATEGORY OPERATIONS
router.get("/categories/:id", getCategoryByID);
router.put('/categories/:id', updateCategoryByID);
router.delete("/categories/:id", deleteCategoryByID);

// SUBCATEGORIES (Nested Routes)
router.get("/categories/:id/subcategories", getSubCategoriesByID);
router.post("/categories/:id/subcategories", addSubcategoryByID);

export default router;