import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id: string; // Already present
     // Add role as an optional property
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface JWT {
    id: string; // Already present
    role?: string; // Add role as an optional property
  }
}