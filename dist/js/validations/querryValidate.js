"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const querrySchema = joi_1.default.object({
    fullNames: joi_1.default.string().required(),
    email: joi_1.default.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    subject: joi_1.default.string().required(),
    message: joi_1.default.string().required().min(10),
});
const ValidateQuerry = (querryData) => {
    return querrySchema.validate(querryData);
};
exports.default = ValidateQuerry;
