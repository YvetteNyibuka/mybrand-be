import { Request, Response } from "express";
import User from "../../models/auth/userSchema";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const httpLogin = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const { email, password } = user;

        const isUserExist = await User.findOne({ email: email });

        if (!isUserExist) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found",
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, isUserExist.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Wrong password",
            });
        }

        const token = Jwt.sign(
            { _id: isUserExist._id, email: isUserExist.email },
            process.env.MY_SECRET_KEY || "FYSHAFRW",
            {
                expiresIn: "1d",
            }
        );

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Login success",
            token: token,
        });
    } catch (error: any) {
        return res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
};