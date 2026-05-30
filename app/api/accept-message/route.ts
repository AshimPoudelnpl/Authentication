import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/app/lib/dbConnect';
import UserModel from '@/app/model/User';

export async function POST(request: Request): Promise<Response> {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            session.user._id,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: 'Message acceptance status updated',
            isAcceptingMessages: updatedUser.isAcceptingMessages,
        });
    } catch (error) {
        console.error('Error updating accept-message status:', error);
        return Response.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(): Promise<Response> {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await UserModel.findById(session.user._id);

        if (!user) {
            return Response.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return Response.json({ success: true, isAcceptingMessages: user.isAcceptingMessages });
    } catch (error) {
        console.error('Error fetching accept-message status:', error);
        return Response.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
