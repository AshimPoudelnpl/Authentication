import dbConnect from "@/app/lib/dbConnect";
import UserModel from "./../../model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";

export async function POST(request: Request): Promise<Response> {
    try {
        await dbConnect();

        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username already taken",
            });
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email already registered",
                });
            }

            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save();
        } else {
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });

            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            });
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email.",
        });
    } catch (error) {
        console.error("Error registering user", error);
        const errorMessage =
            error instanceof Error ? error.message : "Error registering user";

        return Response.json({
            success: false,
            message:
                process.env.NODE_ENV === "production"
                    ? "Error registering user"
                    : errorMessage,
        });
    }
}
