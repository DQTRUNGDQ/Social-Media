"use strict";
exports.__esModule = true;
var express_1 = require("express");
var body_parser_1 = require("body-parser");
require("module-alias/register");
var db_1 = require("./config/db");
var authRoutes_1 = require("./routes/authRoutes");
var userRoutes_1 = require("./routes/userRoutes");
var cors_1 = require("cors");
var cookie_parser_1 = require("cookie-parser");
var app = express_1["default"]();
require("dotenv").config();
// Connect to MongoDB
db_1["default"]();
app.use(cookie_parser_1["default"]());
app.use(cors_1["default"]({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(body_parser_1["default"].json());
app.use(body_parser_1["default"].urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoutes_1["default"]);
// app.use("/api/post", postRoutes);
app.use("/api/users", userRoutes_1["default"]);
var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Server is running on port " + port);
});
