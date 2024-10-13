import express from "express";
import bodyParser from "body-parser";
import "module-alias/register";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import threadRoutes from "./routes/threadRoutes";

const app = express();
require("dotenv").config();

// Connect to MongoDB
connectDB();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/post", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/threads", threadRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
