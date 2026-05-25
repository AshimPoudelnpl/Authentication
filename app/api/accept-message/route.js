import { getServerSession } from "next-auth";
import { authOptions } from "./../auth/[...nextauth]/options";
import dbConnect from "../../lib/dbConnect";
import UserModel from "./../../model/User";

export async function POST(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }
  const userId = session.user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true },
    );
    if (!updatedUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }
    return Response.json({
      success: true,
      message: "Message acceptance status updated",
      isAcceptingMessages: updatedUser.isAcceptingMessages,
    });
  } catch (error) {
    console.error("Error updating accept-message status:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }
  const userId = session.user._id;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }
    return Response.json({
      success: true,
      isAcceptingMessages: user.isAcceptingMessages,
    });
  } catch (error) {
    console.error("Error fetching accept-message status:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
