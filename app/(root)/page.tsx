import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";
import ProfileDisplay from "@/components/ProfileDisplay";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const params = { search: query || null };

  const session = await auth();

  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  return (
    <>
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-white border-b border-zinc-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center flex flex-col items-center">
          {/* Subtle profile display */}
          <div className="mb-8">
             <ProfileDisplay session={session} />
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-tight">
            Discover the Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
              Unicorn Startup.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            PitchPark is the premier network for founders to showcase their ideas and for investors to discover high-potential startups using predictive ML scoring.
          </p>

          <SearchForm query={query} />
        </div>
      </section>

      {/* Main Feed Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            {query ? `Search Results for "${query}"` : "Trending Startups"}
          </h2>
          <span className="text-sm font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
            {posts?.length || 0} found
          </span>
        </div>

        <ul className="flex flex-col gap-6">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
              <p className="text-lg font-semibold text-zinc-900 mb-1">No startups found</p>
              <p className="text-sm text-zinc-500">Try adjusting your search or be the first to submit a pitch.</p>
            </div>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}