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

//categories
router.get("/categories", getCategories);
router.get("/category/:id", getCategoryByID)

router.post("/category", createCategory);
router.put('/category/:id', updateCategoryByID);

//brands
router.get("/brands", getBrands);
router.get("/brand/:id", getBrandByID);

router.post("/brand", createBrand);
router.put("/brand/:id", updateCategoryByID);

router.delete("/brand/:id", deleteBrandByID);

//location
router.get('/locations', getLocations);
router.get("/location/:id", getLocationByID);

router.post("/location", createLocation);
router.put("location/id", updateLocationByID);

router.delete("location/id", deleteLocationByID);

//inventory and IMEI tracking
router.post('/variations/:variation_id/stock', receiveStock);
router.get('/variations/:variation_id/imei', getAvailableImeis);
router.patch('/stock/sell', processSale);








