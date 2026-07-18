import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProfileContent from "@/components/ProfileContent";
import Link from "next/link";
import { MapPin, Mail, Calendar, Settings } from "lucide-react";

export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();

  const isInvestor = user.role === "investor";
  const hasInvestorProfile =
    isInvestor &&
    (user.numberOfInvestments ||
      user.bestInvestments?.length ||
      user.yearsOfExperience ||
      user.investmentTypes?.length ||
      user.investmentStage?.length ||
      user.ticketSize);

  const isOwnProfile = session?.id === id;

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Profile Card */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm sticky top-24">
            
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Image
                  src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                  alt={user.name}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white shadow-md object-cover"
                />
                {isInvestor && (
                  <div className="absolute -bottom-2 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                    Investor
                  </div>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-zinc-900 mb-1">{user.name}</h1>
              <p className="text-sm font-medium text-zinc-500 mb-4">@{user?.username}</p>
              
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                {user?.bio || "No bio provided."}
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-100">
              {isOwnProfile && user?.email && (
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <Mail className="size-4 text-zinc-400" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
            </div>

            {isOwnProfile && (
              <div className="mt-8 pt-6 border-t border-zinc-100">
                <Link
                  href={isInvestor ? "/investor-details" : "/settings"}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 px-4 py-2 rounded-xl transition-colors text-sm font-medium"
                >
                  <Settings className="size-4" />
                  {isInvestor ? "Edit Investor Profile" : "Edit Profile"}
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1">
          {isInvestor && !hasInvestorProfile ? (
            <div className="bg-white border border-dashed border-zinc-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="bg-zinc-50 p-4 rounded-full mb-4">
                <Settings className="size-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Complete Your Profile</h3>
              <p className="text-zinc-500 max-w-md mx-auto mb-6">
                Create an investor profile to start tracking startups, bookmarking pitches, and discovering high-scoring founders.
              </p>
              {isOwnProfile && (
                <Link
                  href="/investor-details"
                  className="bg-primary hover:bg-primary-700 text-white font-medium px-6 py-2.5 rounded-full transition-colors shadow-sm"
                >
                  Create Investor Profile
                </Link>
              )}
            </div>
          ) : (
            <ProfileContent user={user} userId={session?.id || ""} />
          )}
        </section>
        
      </div>
    </main>
  );
};

export default Page;