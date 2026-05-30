import dbConnect from '@/app/lib/dbConnect';
import UserModel from '@/app/model/User';

export async function POST(request: Request): Promise<Response> {
    await dbConnect();
    try {
        const { username, code } = await request.json();

        if (!username || !code) {
            return Response.json(
                { success: false, message: 'Username and code are required' },
                { status: 400 }
            );
        }

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json(
                { success: false, message: 'Invalid username or code' },
                { status: 400 }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = user.verifyCodeExpiry < new Date();

        if (isCodeValid && !isCodeExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({ success: true, message: 'User verified successfully' });
        }

        if (isCodeExpired) {
            return Response.json(
                { success: false, message: 'Verification code has expired. Please sign up again.' },
                { status: 400 }
            );
        }

        return Response.json(
            { success: false, message: 'Invalid verification code' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Error verifying code:', error);
        return Response.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
