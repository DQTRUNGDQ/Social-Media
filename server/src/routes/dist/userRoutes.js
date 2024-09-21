"use strict";
exports.__esModule = true;
var express_1 = require("express");
var userController_1 = require("~/controllers/userController");
var auth_1 = require("~/middlewares/auth");
var router = express_1["default"].Router();
// Route lấy thông tin người dùng hiện tại
router.get("/profile", auth_1["default"], userController_1.getProfile);
exports["default"] = router;
