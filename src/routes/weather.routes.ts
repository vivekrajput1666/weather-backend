import { Router } from "express";
import { getWeatherController } from "../controllers/weather.controller.js";

const router = Router();

router.get("/", getWeatherController);

export default router;
