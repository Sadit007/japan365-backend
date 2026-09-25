import express from "express";
import { processSale, getAvailableImeis, receiveStock } from "../controllers/inventoryController.js";

const router = express.Router();


//inventory and IMEI tracking
router.post('/variations/:variation_id/stock', receiveStock);
router.get('/variations/:variation_id/imei', getAvailableImeis);
router.patch('/stock/sell', processSale);


export default router;