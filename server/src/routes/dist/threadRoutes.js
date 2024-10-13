"use strict";
exports.__esModule = true;
var express_1 = require("express");
var uploadMiddleware_1 = require("~/middlewares/uploadMiddleware");
var threadController_1 = require("~/controllers/threadController");
var auth_1 = require("~/middlewares/auth");
var router = express_1["default"].Router();
router.post("/upload", uploadMiddleware_1["default"].single("media"), auth_1["default"], threadController_1.createThread);
exports["default"] = router;
