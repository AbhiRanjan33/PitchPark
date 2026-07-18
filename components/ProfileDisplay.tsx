// components/ProfileDisplay.tsx
"use client";

import Image from "next/image";
import { getRoleFromStorage } from "../app/role";
import { Session } from "next-auth";

type ProfileDisplayProps = {
  session: Session | null;
};

export default function ProfileDisplay({ session }: ProfileDisplayProps) {
  const role = getRoleFromStorage();

  console.log("Selected Role from Storage:", role);

  return (
    <>
      {session?.user ? (
        <div className="flex items-center gap-4 mb-6">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-[3px] border-black" // Match profile_image style
            />
          )}
          <div>
            <p className="text-20-medium text-white font-work-sans">
              Welcome, {session.user.name || "User"}
            </p>
            <p className="text-14-normal font-work-sans">
              Role: {role || "Not set"}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-14-normal font-work-sans text-center">
          Please sign in to continue
        </p>
      )}
    </>
  );
}