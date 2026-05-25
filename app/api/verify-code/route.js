import dbConnect from "./../../lib/dbConnect";
import UserModel from "@/app/model/User";

export async function POST(request) {
  const origin = request.headers.get("origin");
  const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  if (!origin || origin !== allowedOrigin) {
    return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
  }
  await dbConnect();
  try {
    const { username, code } = await request.json();
    if (!username || !code) {
      return Response.json(
        {
          success: false,
          message: "Username and code are required",
        },
        { status: 400 },
      );
    }
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        { success: false, message: "Invalid username or code" },
        { status: 400 },
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = user.verifyCodeExpiry < new Date();
    if (isCodeValid && !isCodeExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json({
        success: true,
        message: "User verified successfully",
      });
    } else if (isCodeExpired) {
      return Response.json(
        { success: false, message: "Verification code has expired" },
        { status: 400 },
      );
    } else {
      return Response.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
