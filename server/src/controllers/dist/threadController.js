"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getLikedThreads = exports.toggleLike = exports.createThread = exports.getThread = void 0;
var Thread_1 = require("~/models/Thread");
var User_1 = require("~/models/User");
var threadService_1 = require("~/services/threadService");
var firebaseConfig_1 = require("~/config/firebaseConfig");
var uuid_1 = require("uuid");
var Hashtag_1 = require("~/models/Hashtag");
var asyncHandler_1 = require("~/middlewares/asyncHandler");
var console_1 = require("console");
var AppError_1 = require("~/utils/AppError");
var Like_1 = require("~/models/Like");
var createThread = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var content, _a, textContent, hashtags, file, fileName, fileUpload, blobStream;
    return __generator(this, function (_b) {
        content = req.body.content;
        _a = threadService_1.processPostContent(content), textContent = _a.textContent, hashtags = _a.hashtags;
        file = req.file;
        if (!file) {
            return [2 /*return*/, res.status(400).send("Không có file được tải lên")];
        }
        fileName = "Media/" + uuid_1.v4() + "-" + file.originalname;
        fileUpload = firebaseConfig_1.bucket.file(fileName);
        blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });
        blobStream.on("error", function (error) {
            return res.status(500).json({ message: "Lỗi khi upload file", error: error });
        });
        blobStream.on("finish", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fileUrl, newThread, post, _i, hashtags_1, hashtag, existingHashtag, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fileUpload.makePublic()];
                    case 1:
                        _a.sent();
                        fileUrl = "https://firebasestorage.googleapis.com/v0/b/" + firebaseConfig_1.bucket.name + "/o/" + encodeURIComponent(fileName) + "?alt=media";
                        newThread = {
                            content: textContent,
                            hashtags: hashtags,
                            images: file.mimetype.includes("image") ? [fileUrl] : [],
                            videos: file.mimetype.includes("video") ? [fileUrl] : [],
                            mediaUrl: fileUrl,
                            mediaType: file.mimetype.includes("image") ? "image" : "video",
                            author: req.user,
                            createdAt: new Date()
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, , 10]);
                        return [4 /*yield*/, Thread_1["default"].create(newThread)];
                    case 3:
                        post = _a.sent();
                        _i = 0, hashtags_1 = hashtags;
                        _a.label = 4;
                    case 4:
                        if (!(_i < hashtags_1.length)) return [3 /*break*/, 8];
                        hashtag = hashtags_1[_i];
                        return [4 /*yield*/, Hashtag_1["default"].findOne({ name: hashtag })];
                    case 5:
                        existingHashtag = _a.sent();
                        if (!existingHashtag) {
                            // Nếu hashtag chưa tồn tại, tạo mới
                            existingHashtag = new Hashtag_1["default"]({ name: hashtag });
                        }
                        // Cập nhật số lần sử dụng và thêm threadId vào mảng threads
                        existingHashtag.usageCount += 1; // Tăng usageCount
                        if (!existingHashtag.threadsId.includes(post.id)) {
                            existingHashtag.threadsId.push(post.id); // Thêm threadId
                        }
                        return [4 /*yield*/, existingHashtag.save()];
                    case 6:
                        _a.sent(); // Lưu lại
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 4];
                    case 8: return [2 /*return*/, res.status(200).json({ message: "Bài viết đã được tạo!", post: post })];
                    case 9:
                        error_1 = _a.sent();
                        return [2 /*return*/, res.status(500).json({ message: "Lỗi khi tạo bài viết", error: error_1 })];
                    case 10: return [2 /*return*/];
                }
            });
        }); });
        blobStream.end(file.buffer);
        return [2 /*return*/, new Promise(function (relsove) {
                blobStream.on("finish", function () { return relsove(res); });
            })];
    });
}); };
exports.createThread = createThread;
var getThread = asyncHandler_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var user, posts, likedPosts, likedPostIds_1, formattedPosts, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                return [4 /*yield*/, User_1["default"].findById(req.user.id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, next(new AppError_1.AppError("User not found", 404))];
                }
                return [4 /*yield*/, Thread_1["default"].find()
                        .populate("author", "username _id avatar")
                        .sort({ createdAt: -1 })];
            case 2:
                posts = _b.sent();
                return [4 /*yield*/, Like_1["default"].find({ user: req.user.id }).distinct("threadId")];
            case 3:
                likedPosts = _b.sent();
                likedPostIds_1 = likedPosts.map(function (id) { return id.toString(); });
                formattedPosts = posts.map(function (post) { return (__assign(__assign({}, post.toObject()), { isLiked: likedPostIds_1.length > 0
                        ? likedPostIds_1.includes(post._id.toString())
                        : false })); });
                res.json({ posts: formattedPosts });
                return [3 /*break*/, 5];
            case 4:
                _a = _b.sent();
                console.error(console_1.error);
                res.status(500).json({ message: "Error fetching posts" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.getThread = getThread;
var toggleLike = asyncHandler_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var threadId, userId, thread, user, username, existingLike, newLike, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                threadId = req.body.threadId;
                userId = req.user.id;
                return [4 /*yield*/, Thread_1["default"].findById(threadId)];
            case 1:
                thread = _a.sent();
                if (!thread) {
                    res
                        .status(404)
                        .json({ message: "Thread no longer exists or has been deleted" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, User_1["default"].findById(userId, "username")];
            case 2:
                user = _a.sent();
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return [2 /*return*/];
                }
                username = user.username;
                if (!username) {
                    // Nếu chưa có username, tạo username ngẫu nhiên
                    username = generateRandomUsername();
                }
                return [4 /*yield*/, Like_1["default"].findOne({ threadId: threadId, user: userId })];
            case 3:
                existingLike = _a.sent();
                if (!existingLike) return [3 /*break*/, 6];
                // Nếu đã like thì thực hiện unlike (xóa like)
                return [4 /*yield*/, Like_1["default"].deleteOne({ _id: existingLike._id })];
            case 4:
                // Nếu đã like thì thực hiện unlike (xóa like)
                _a.sent();
                if (thread.likesCount > 0) {
                    thread.likesCount--;
                }
                return [4 /*yield*/, thread.save()];
            case 5:
                _a.sent();
                res.status(200).json({
                    isLiked: false,
                    likesCount: thread.likesCount
                });
                return [3 /*break*/, 9];
            case 6:
                newLike = new Like_1["default"]({
                    threadId: threadId,
                    user: userId,
                    username: username,
                    createdAt: new Date()
                });
                return [4 /*yield*/, newLike.save()];
            case 7:
                _a.sent();
                thread.likesCount++;
                return [4 /*yield*/, thread.save()];
            case 8:
                _a.sent();
                res.status(200).json({
                    isLiked: true,
                    likesCount: thread.likesCount
                });
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
exports.toggleLike = toggleLike;
var getLikedThreads = asyncHandler_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var userId, likedThreads, likedThreadData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user.id;
                return [4 /*yield*/, Like_1["default"].find({ user: userId }).populate("threadId")];
            case 1:
                likedThreads = _a.sent();
                if (!likedThreads || likedThreads.length === 0) {
                    res.status(404).json([]);
                }
                likedThreadData = likedThreads.map(function (like) { return like.threadId; });
                res.status(200).json(likedThreadData);
                return [2 /*return*/];
        }
    });
}); });
exports.getLikedThreads = getLikedThreads;
function generateRandomUsername() {
    var words = [
        "cool",
        "super",
        "great",
        "happy",
        "awesome",
        "smart",
        "bright",
        "shiny",
        "star",
        "moon",
        "sky",
        "quick",
        "fast",
        "sun",
        "fire",
        "wave",
        "cloud",
    ];
    var randomWord = words[Math.floor(Math.random() * words.length)];
    var randomNum = Math.floor(Math.random() * 1000);
    // Tạo username có dạng: "cool123" với độ dài khoảng 15 ký tự
    return "@" + randomWord + randomNum;
}
