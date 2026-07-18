import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
           {/* Navbar is here, so it appears on all pages */}
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}