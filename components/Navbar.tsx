"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { BadgePlus, LogOut, User, Menu } from "lucide-react";
import { getRoleFromStorage } from "../app/role";
import Ping from "./Ping";

const Navbar = () => {
  const { data: session, status } = useSession();

  // Get role from storage
  const role = getRoleFromStorage();
  const isInvestor = role === "investor";

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-zinc-200 transition-all">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Minimalist Logo placeholder (could be an SVG) */}
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold tracking-tight shadow-sm group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">PitchPark</span>
          </Link>
          <div className="hidden md:flex ml-2">
             {status === "loading" ? null : <Ping />}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="w-20 h-9 bg-zinc-200 animate-pulse rounded-full"></div>
          ) : session ? (
            <>
              {isInvestor ? (
                <Link
                  href="/investor-details"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  <User className="size-4" />
                  <span>Update Profile</span>
                </Link>
              ) : (
                <Link
                  href="/startup/create"
                  className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-full shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <BadgePlus className="size-4" />
                  <span>Submit Pitch</span>
                </Link>
              )}
              
              <div className="h-6 w-px bg-zinc-200 mx-1 hidden sm:block"></div>

              {session.user?.image && (
                <Link href={`/user/${session.id}`} className="hover:ring-2 hover:ring-primary/20 rounded-full transition-all">
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full border border-zinc-200"
                  />
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="size-4" />
              </button>
              
              {/* Mobile menu button */}
              <button className="sm:hidden text-zinc-600 hover:text-zinc-900">
                <Menu className="size-6" />
              </button>
            </>
          ) : (
            <Link href="/signin-role">
              <button className="bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium px-5 py-2 rounded-full shadow-sm transition-all hover:-translate-y-0.5">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;