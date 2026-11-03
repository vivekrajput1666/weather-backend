import { Request, Response } from "express";
import { getWeather } from "../services/weather.services.js";

export const getWeatherController = async (
req: Request,
res: Response
) => {
try {
const latitude = Number(req.query.latitude);
const longitude = Number(req.query.longitude);

if (
  req.query.latitude === undefined ||
  req.query.longitude === undefined ||
  !Number.isFinite(latitude) ||
  !Number.isFinite(longitude) ||
  latitude < -90 ||
  latitude > 90 ||
  longitude < -180 ||
  longitude > 180
) {
  res.status(400).json({
    success: false,
    message: "Please provide valid latitude and longitude.",
  });
  return;
}

const weather = await getWeather(latitude, longitude);

res.json({
  success: true,
  data: weather,
});

} catch (error) {
res.status(500).json({
success: false,
message: "Failed to fetch weather data.",
});
}
};
