import axios from "axios";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Cache: key -> { data, expires }
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_MS = 10 * 60 * 1000; // 10 minutes

export const getWeather = async (latitude: number, longitude: number) => {
  // Round coordinates so nearby searches share one cache entry
  const key = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;

  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  const tries = 3;
  for (let i = 0; i < tries; i++) {
    try {
      const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: {
          latitude,
          longitude,
          current: "temperature_2m,relative_humidity_2m,wind_speed_10m",
        },
        timeout: 10000,
      });

      cache.set(key, { data: response.data, expires: Date.now() + CACHE_MS });
      return response.data;
    } catch (err: any) {
      const isRateLimited = err.response?.status === 429;
      if (!isRateLimited || i === tries - 1) throw err;
      await sleep(1500 * (i + 1)); // wait 1.5s, then 3s, then give up
    }
  }
};