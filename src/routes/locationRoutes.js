import express from "express";

const router = express.Router();



//location
router.get('/locations', getLocations);
router.get("/location/:id", getLocationByID);

router.post("/location", createLocation);
router.put("location/id", updateLocationByID);

router.delete("location/id", deleteLocationByID);

export default locationRoutes;