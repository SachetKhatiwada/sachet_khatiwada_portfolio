import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      role?:string;
      username?: string;
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    role?:string;
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    username?: string;
  }
}
