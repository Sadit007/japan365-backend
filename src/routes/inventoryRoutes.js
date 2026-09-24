import express from "express";

const router = express.Router();


//inventory and IMEI tracking
router.post('/variations/:variation_id/stock', receiveStock);
router.get('/variations/:variation_id/imei', getAvailableImeis);
router.patch('/stock/sell', processSale);


export default inventoryRoutes;