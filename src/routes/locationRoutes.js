import express from "express";
import { getLocationByID, getLocations, createLocation, updateLocationByID, deleteLocationByID } from "../controllers/locationController.js";

const router = express.Router();

//location
router.get('/locations', getLocations);
router.get("/locations/:id", getLocationByID);

router.post("/locations", createLocation);
router.put("/locations/:id", updateLocationByID);

router.delete("/locations/:id", deleteLocationByID);

export default router;