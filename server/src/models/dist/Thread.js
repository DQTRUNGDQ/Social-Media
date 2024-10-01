"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var threadSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: [true, "thread content is required"],
        minlength: [1, "Content must be at least 1 character"],
        maxlength: [5000, "Content cannot exceed 5000 characters"]
    },
    hashtags: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Hashtag"
        },
    ],
    images: [String],
    videos: [String],
    poll: {
        question: String,
        options: [
            {
                option: String,
                votes: { type: Number, "default": 0 }
            },
        ],
        expiresAt: Date
    },
    visibility: {
        type: String,
        "enum": ["public", "friends", "only_me"],
        "default": "public"
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        "default": Date.now
    },
    likesCount: {
        type: Number,
        "default": 0
    },
    commentsCount: {
        type: Number,
        "default": 0
    },
    repostsCount: {
        type: Number,
        "default": 0
    },
    sharesCount: {
        type: Number,
        "default": 0
    }
});
var likeSchema = new mongoose_1.Schema({
    threadId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Thread", required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, "default": Date.now }
});
var commentSchema = new mongoose_1.Schema({
    threadId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Thread", required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, "default": Date.now }
});
var shareSchema = new mongoose_1.Schema({
    threadId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Thread", required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, "default": Date.now }
});
var repostSchema = new mongoose_1.Schema({
    threadId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Thread", required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, "default": Date.now }
});
var models = {
    Thread: mongoose_1["default"].model("Thread", threadSchema),
    Like: mongoose_1["default"].model("Like", likeSchema),
    Comment: mongoose_1["default"].model("Comment", commentSchema),
    Share: mongoose_1["default"].model("Share", shareSchema),
    Repost: mongoose_1["default"].model("Repost", repostSchema)
};
