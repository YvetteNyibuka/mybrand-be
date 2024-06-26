"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const cloudinary_1 = require("cloudinary");
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const documentedUI_1 = __importDefault(require("./documentedUI"));
require('dotenv').config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({
    extended: true,
}));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const corsOpts = {
    origin: '*',
    methods: [
        'GET',
        'POST',
        'DELETE',
        'PATCH',
        'PUT'
    ],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
    ],
};
app.use((0, cors_1.default)(corsOpts));
app.use(express_1.default.json());
app.use('/api/v1', index_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(documentedUI_1.default));
app.get('/api/v1', (req, res) => {
    res.status(200).json({ message: 'Welcome to my blogs API' });
});
exports.default = app;
