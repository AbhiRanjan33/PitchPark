"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Ping from "./Ping";
import Image from "next/image";
import { BadgePlus, LogOut, User } from "lucide-react";
import { getRoleFromStorage } from "../app/role";

const Navbar = () => {
  const { data: session, status } = useSession();

  console.log("Navbar Session:", session, "Status:", status);

  if (status === "loading") {
    return (
      <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <div className="flex items-center">
          <span className="mr-2 text-lg font-semibold">Pitch Park</span>
          <Ping />
        </div>
        <div>
          <p>Loading...</p>
        </div>
      </nav>
    );
  }

  // Get role from storage
  const role = getRoleFromStorage();
  const isInvestor = role === "investor";

  console.log("Navbar - Selected Role from Storage:", role);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <Link href="/">
          <span className="mr-2 text-lg font-semibold">Pitch Park</span>
        </Link>
        <Ping />
      </div>
      <div className="flex items-center gap-5">
        {session ? (
          <>
            {isInvestor ? (
              <Link
                href="/investor-details"
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-all"
              >
                <User className="size-5" />
                <span className="hidden sm:inline">Create Details</span>
              </Link>
            ) : (
              <Link
                href="/startup/create"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition-all"
              >
                <BadgePlus className="size-5" />
                <span className="hidden sm:inline">Create</span>
              </Link>
            )}
            {session.user?.image && (
              <Link href={`/user/${session.id}`}>
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg shadow text-white transition-all"
            >
              <LogOut className="inline size-5 mr-2" />
              Logout
            </button>
          </>
        ) : (
          <Link href="/signin-role">
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg shadow text-white transition-all">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;