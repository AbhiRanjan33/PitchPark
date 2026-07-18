"use client";

import { Suspense } from "react";
import UserStartups from "@/components/UserStartups";
import { StartupCardSkeleton } from "@/components/StartupCard";
import { getRoleFromStorage } from "../app/role";
import { Briefcase, BarChart, Target, Rocket, PieChart, Landmark } from "lucide-react";

type ProfileContentProps = {
  user: {
    _id: string;
    name: string;
    username?: string;
    email?: string;
    image: string;
    bio?: string;
    role?: string;
    numberOfInvestments?: number;
    bestInvestments?: string[];
    yearsOfExperience?: number;
    investmentTypes?: string[];
    investmentStage?: string[];
    ticketSize?: number;
  };
  userId: string;
};

export default function ProfileContent({ user, userId }: ProfileContentProps) {
  const role = getRoleFromStorage();
  const isOwnProfile = user._id === userId;

  // Dummy data for investor profile (since it's a tutorial artifact, keeping it but styling it well)
  const dummyInvestorData = {
    numberOfInvestments: 15,
    bestInvestments: "TechTrend Innovations, HealthSync Solutions, GreenWave Energy",
    yearsOfExperience: 8,
    investmentTypes: "Angel, Venture Capital",
    investmentStage: "Seed, Series A",
    ticketSize: 10000000,
  };

  return (
    <div className="flex flex-col gap-8">
      {role === "investor" ? (
        <Suspense fallback={<div className="h-[400px] rounded-3xl bg-zinc-100 animate-pulse"></div>}>
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900 mb-8 pb-4 border-b border-zinc-100">Investor Portfolio</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-zinc-100">
                  <Briefcase className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Total Investments</p>
                  <p className="text-xl font-bold text-zinc-900">{dummyInvestorData.numberOfInvestments}</p>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-zinc-100">
                  <Landmark className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Ticket Size</p>
                  <p className="text-xl font-bold text-zinc-900">₹{(dummyInvestorData.ticketSize / 100000).toFixed(0)}L+</p>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-zinc-100">
                  <Target className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Preferred Stage</p>
                  <p className="text-sm font-semibold text-zinc-900 mt-1">{dummyInvestorData.investmentStage}</p>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-zinc-100">
                  <PieChart className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Investment Types</p>
                  <p className="text-sm font-semibold text-zinc-900 mt-1">{dummyInvestorData.investmentTypes}</p>
                </div>
              </div>

              <div className="md:col-span-2 bg-zinc-50 border border-zinc-100 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-zinc-100 shrink-0">
                  <Rocket className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Best Performing Investments</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dummyInvestorData.bestInvestments.split(',').map((inv, idx) => (
                      <span key={idx} className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-sm font-medium text-zinc-700 shadow-sm">
                        {inv.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Suspense>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
              {isOwnProfile ? "Your Submitted Pitches" : `Pitches by ${user.name}`}
            </h2>
          </div>
          
          <ul className="flex flex-col gap-6">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartups id={user._id} />
            </Suspense>
          </ul>
        </div>
      )}
    </div>
  );
}