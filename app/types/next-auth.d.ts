import 'next-auth';

declare module 'next-auth' {
    interface User  {
        _id?: string;
        email: string;
        name: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}
