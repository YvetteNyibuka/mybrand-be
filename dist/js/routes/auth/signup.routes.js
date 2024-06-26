"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../../middlewares/authorization");
const user_controllers_1 = require("../../controllers/auth/user.controllers");
const userMiddleware_1 = __importDefault(require("../../middlewares/auth/userMiddleware"));
const userRoutes = express_1.default.Router();
userRoutes.post('/register', userMiddleware_1.default, user_controllers_1.httpCreateUser);
userRoutes.get('/', authorization_1.isAdmin, user_controllers_1.httpGetUsers);
userRoutes.get('/:id', authorization_1.isAdmin, user_controllers_1.httpGetOneUser);
userRoutes.patch('/:id', authorization_1.isAdmin, user_controllers_1.httpUpdateOneUser);
userRoutes.delete('/:id', authorization_1.isAdmin, user_controllers_1.deletesingleUser);
exports.default = userRoutes;
