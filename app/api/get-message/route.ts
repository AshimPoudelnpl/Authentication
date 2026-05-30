import { getServerSession } from 'next-auth';
import { authOptions } from './../auth/[...nextauth]/options';
import dbConnect from './../../lib/dbConnect';
import UserModel from '@/app/model/User';
import mongoose from 'mongoose';

export async function GET() {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({ 
                success: false, 
                message: "Unauthorized" }, 
                { status: 401 });
        }

        const userId = new mongoose.Types.ObjectId(session.user._id as string);

        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } },
        ]);

        if (!user || user.length === 0) {
            return Response.json({ 
                success: false, 
                message: "User not found" }, 
                { status: 404 });
        }

        return Response.json({ 
            success: true, 
            messages: user[0].messages ?? [] }, 
            { status: 200 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
