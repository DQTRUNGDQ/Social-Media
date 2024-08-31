import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db";

const app = express();
require("dotenv").config();

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
