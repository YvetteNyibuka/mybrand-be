"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const commentSchema = joi_1.default.object({
    commentMessage: joi_1.default.string().required(),
    blogId: joi_1.default.string(),
    username: joi_1.default.string()
});
const validateComment = (commentData) => {
    return commentSchema.validate(commentData);
};
exports.default = validateComment;
