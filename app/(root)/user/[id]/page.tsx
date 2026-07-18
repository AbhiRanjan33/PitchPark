import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProfileContent from "@/components/ProfileContent";
import Link from "next/link";

export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();

  // Debugging: Log user role and session
  console.log("User role from Sanity:", user.role);
  console.log("Session:", session);

  // Check if investor profile exists
  const isInvestor = user.role === "investor";
  const hasInvestorProfile =
    isInvestor &&
    (user.numberOfInvestments ||
      user.bestInvestments?.length ||
      user.yearsOfExperience ||
      user.investmentTypes?.length ||
      user.investmentStage?.length ||
      user.ticketSize);

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>

          <Image
            src={user.image}
            alt={user.name}
            width={220}
            height={220}
            className="profile_image"
          />

          <p className="text-30-extrabold mt-7 text-center">
            @{user?.username}
          </p>
          {session?.id === id && (
            <p className="text-16-medium mt-2 text-center">
              {user?.email || "Email not provided"}
            </p>
          )}
          <p className="mt-2 text-center text-14-normal">{user?.bio}</p>
        </div>

        {isInvestor && !hasInvestorProfile ? (
          <div className="flex-1 flex flex-col gap-5 lg:-mt-5 text-center">
            <p className="text-20-medium">
              Create a profile first to view or edit your investor details.
            </p>
            <Link
              href="/investor-details"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow transition-all"
            >
              Create Investor Profile
            </Link>
          </div>
        ) : (
          <ProfileContent user={user} userId={session?.id || ""} />
        )}
      </section>
    </>
  );
};

export default Page;