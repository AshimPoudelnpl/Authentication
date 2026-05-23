import dbConnect from './../../lib/dbConnect';
import UserModel from '@/app/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/app/schemas/signUpSchema';

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryparam = {
             username: searchParams.get("username")
             }

        const result = UsernameQuerySchema.safeParse(queryparam);
        if (!result.success) {
            const errors = result.error.format().username?._errors;
            return Response.json({ 
                success: false, 
                message: errors?.join(", ") || "Invalid username" }, 
                { status: 400 });
        }

        const existingUser = await UserModel.findOne({
             username: result.data.username, 
             isVerified: true 
            });
        if (existingUser) {
            return Response.json({
                 success: false,
                  message: "Username already taken" }, 
                  { status: 400 });
        }

        return Response.json({ 
            success: true,
             message: "Username is available"},
             { status: 200 });
    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}