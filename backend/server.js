import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Ensure cors is properly imported

// Import your routes
// import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";

dotenv.config();

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err.message);
  });

const app = express();

// Middleware
app.use(cors()); // Add CORS middleware early to handle cross-origin requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
app.get("/api/keys/google", (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || "" });
});

app.use("/api/upload", uploadRouter);
// app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

// Serve frontend static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
