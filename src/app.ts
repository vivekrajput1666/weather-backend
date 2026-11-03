import express from "express";
import cors from "cors";
import weatherRoutes from "./routes/weather.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/weather", weatherRoutes);

app.get("/api/health", (req, res) => {
res.json({
success: true,
message: "Backend is running!",
});
});

export default app;
