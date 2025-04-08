"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.updateUserProfile = exports.getProfile = void 0;
var User_1 = require("~/models/User");
var asyncHandler_1 = require("~/middlewares/asyncHandler");
var AppError_1 = require("~/utils/AppError");
var uuid_1 = require("uuid");
var firebaseConfig_1 = require("~/config/firebaseConfig");
exports.getProfile = asyncHandler_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1["default"].findById(req.user.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, next(new AppError_1.AppError("User not found", 404))];
                }
                res.json({ user: user });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).send({ error: "Server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.updateUserProfile = asyncHandler_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bio, link, avatar, file, extractOldFileName, user_1, oldFileName, fileName_1, fileUpload_1, blobStream, oldFileName, oldFileName, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, bio = _a.bio, link = _a.link, avatar = _a.avatar;
                file = req.file;
                console.log("Received file:", file); // Thêm dòng này để kiểm tra
                extractOldFileName = function (url) {
                    var _a;
                    try {
                        var encoded = (_a = url.split("/o/")[1]) === null || _a === void 0 ? void 0 : _a.split("?alt=media")[0];
                        return encoded ? decodeURIComponent(encoded) : null;
                    }
                    catch (_b) {
                        return null;
                    }
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 14, , 15]);
                return [4 /*yield*/, User_1["default"].findById(req.user.id)];
            case 2:
                user_1 = _b.sent();
                if (!user_1) {
                    return [2 /*return*/, next(new AppError_1.AppError("User not found", 404))];
                }
                // Kiểm tra lại bio trước khi lưu
                if (bio !== undefined && bio.length > 200) {
                    return [2 /*return*/, next(new AppError_1.AppError("Bio cannot exceed 200 characters", 400))];
                }
                if (bio !== undefined)
                    user_1.bio = bio;
                if (link !== undefined)
                    user_1.link = link;
                if (!file) return [3 /*break*/, 5];
                oldFileName = extractOldFileName(user_1.avatar || "");
                if (!oldFileName) return [3 /*break*/, 4];
                return [4 /*yield*/, firebaseConfig_1.bucket
                        .file(oldFileName)["delete"]()["catch"](function () { })];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                fileName_1 = "Avatar/" + uuid_1.v4() + "-" + file.originalname;
                fileUpload_1 = firebaseConfig_1.bucket.file(fileName_1);
                blobStream = fileUpload_1.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });
                blobStream.on("error", function (error) {
                    console.error("Error uploading to Firebase:", error);
                    return next(new AppError_1.AppError("Failed to upload avatar", 500));
                });
                blobStream.on("finish", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var fileUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fileUpload_1.makePublic()];
                            case 1:
                                _a.sent();
                                fileUrl = "https://firebasestorage.googleapis.com/v0/b/" + firebaseConfig_1.bucket.name + "/o/" + encodeURIComponent(fileName_1) + "?alt=media";
                                // Cật nhật avatar mới
                                user_1.avatar = fileUrl;
                                return [4 /*yield*/, user_1.save()];
                            case 2:
                                _a.sent();
                                return [2 /*return*/, res.status(200).json({
                                        message: "Profile updated successfully",
                                        avatar: user_1.avatar,
                                        user: user_1
                                    })];
                        }
                    });
                }); });
                blobStream.end(file.buffer);
                return [3 /*break*/, 13];
            case 5:
                if (!(avatar === "")) return [3 /*break*/, 8];
                oldFileName = extractOldFileName(user_1.avatar || "");
                if (!oldFileName) return [3 /*break*/, 7];
                return [4 /*yield*/, firebaseConfig_1.bucket
                        .file(oldFileName)["delete"]()["catch"](function () { })];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                user_1.avatar = "";
                return [3 /*break*/, 13];
            case 8:
                if (!(!avatar && !file)) return [3 /*break*/, 11];
                oldFileName = extractOldFileName(user_1.avatar || "");
                if (!oldFileName) return [3 /*break*/, 10];
                return [4 /*yield*/, firebaseConfig_1.bucket
                        .file(oldFileName)["delete"]()["catch"](function () { })];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10:
                // Nếu avatar là chuỗi rỗng, tức người dùng muốn xóa avatar
                user_1.avatar = avatar; // có thể avatar === ""
                _b.label = 11;
            case 11: return [4 /*yield*/, user_1.save()];
            case 12:
                _b.sent();
                res.status(200).json({
                    message: "Profile updated successfully",
                    user: user_1
                });
                _b.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                error_2 = _b.sent();
                if (error_2.name === "ValidationError") {
                    return [2 /*return*/, next(new AppError_1.AppError(error_2.message, 400))];
                }
                res.status(500).json({ error: "Server error" });
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); });
