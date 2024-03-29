import express, { Router } from 'express';
import {isAdmin} from '../../middlewares/authorization'

import {
    httpCreateUser,
    httpGetUsers,
    httpGetOneUser,
    httpUpdateOneUser,
    deletesingleUser,
} from "../../controllers/auth/user.controllers";
import isValid from "../../middlewares/auth/userMiddleware";

const userRoutes: Router = express.Router();

userRoutes.post('/register',isValid, httpCreateUser);
userRoutes.get('/', isAdmin,httpGetUsers);
userRoutes.get('/:id', isAdmin, httpGetOneUser);
userRoutes.patch('/:id',isAdmin, httpUpdateOneUser);
userRoutes.delete('/:id', isAdmin, deletesingleUser);

export default userRoutes;
