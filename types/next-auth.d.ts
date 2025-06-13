// types/next-auth.d.ts

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      hotelId: number;
    };
  }
}
