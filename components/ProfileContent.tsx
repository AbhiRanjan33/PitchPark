"use client";

import { Suspense } from "react";
import UserStartups from "@/components/UserStartups";
import { StartupCardSkeleton } from "@/components/StartupCard";
import { getRoleFromStorage } from "../app/role";

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

  console.log("ProfileContent - Selected Role from Storage:", role);

  // Dummy data for investor profile
  const dummyInvestorData = {
    numberOfInvestments: 15,
    bestInvestments: "TechTrend Innovations, HealthSync Solutions, GreenWave Energy",
    yearsOfExperience: 8,
    investmentTypes: "Angel, Venture Capital",
    investmentStage: "Seed, Series A",
    ticketSize: 10000000,
  };

  return (
    <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
      {role === "investor" ? (
        <Suspense fallback={<div>Loading investor profile...</div>}>
          <div className="section-card p-6">
            <h3 className="text-30-semibold mb-4">Investor Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-16-medium">
              <p>
                <span className="font-semibold">Number of Investments:</span>{" "}
                {dummyInvestorData.numberOfInvestments}
              </p>
              <p>
                <span className="font-semibold">Best Investments:</span>{" "}
                {dummyInvestorData.bestInvestments}
              </p>
              <p>
                <span className="font-semibold">Years of Experience:</span>{" "}
                {dummyInvestorData.yearsOfExperience}
              </p>
              <p>
                <span className="font-semibold">Type of Investments:</span>{" "}
                {dummyInvestorData.investmentTypes}
              </p>
              <p>
                <span className="font-semibold">Investment Stage:</span>{" "}
                {dummyInvestorData.investmentStage}
              </p>
              <p>
                <span className="font-semibold">Ticket Size:</span>{" "}
                ₹{dummyInvestorData.ticketSize.toLocaleString()}
              </p>
            </div>
          </div>
        </Suspense>
      ) : (
        <>
          <p className="text-30-bold">
            {user._id === userId ? "Your" : "All"} Startups
          </p>
          <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartups id={user._id} />
            </Suspense>
          </ul>
        </>
      )}
    </div>
  );
}