import GrowthChart from "@/components/GrowthChart";
import FundingSourcesChart from "@/components/FundingSourcesChart";
import RevenueVsExpensesChart from "@/components/RevenueVsExpensesChart";
import RevenueByProductChart from "@/components/RevenueByProductChart";
import StartupScoreClient from "@/components/StartupScoreClient";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { Suspense } from "react";
import AIFeedbackClient from "@/components/AiFeedbackClient";
import { MapPin, Calendar, Users, TrendingUp, DollarSign, Globe, Briefcase } from "lucide-react";

const md = markdownit();

export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const [post, playlistData] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks-new" }),
  ]);

  if (!post) return notFound();

  const editorPosts = playlistData?.select || [];
  const parsedContent = md.render(post?.pitch || "");

  const chartTheme = {
    backgroundColor: [
      'rgba(79, 70, 229, 0.8)', // indigo-600
      'rgba(244, 244, 245, 0.8)', // zinc-100
      'rgba(39, 39, 42, 0.8)', // zinc-800
      'rgba(165, 180, 252, 0.5)', // indigo-300
      'rgba(9, 9, 11, 0.5)', // zinc-950
    ],
    borderColor: '#ffffff',
    borderWidth: 2,
    font: {
      family: 'Inter, sans-serif',
      size: 12,
      weight: '500',
    },
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      
      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary/10 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {post.category}
              </span>
              <span className="text-sm font-medium text-zinc-500">
                {formatDate(post?._createdAt)}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight mb-4">
              {post.title}
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-600 font-medium leading-relaxed max-w-3xl">
              {post.description}
            </p>
          </div>

          {/* Author Info */}
          <Link
            href={`/user/${post.author?._id}`}
            className="inline-flex items-center gap-3 p-2 pr-4 rounded-full bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 transition-colors"
          >
            <Image
              src={post.author?.image || "/195146744.webp"}
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="text-sm font-semibold text-zinc-900 leading-none mb-1">
                {post.author?.name || "Abhi"}
              </p>
              <p className="text-xs font-medium text-zinc-500 leading-none">
                @{post.author?.username || "AbhiRanjan33"}
              </p>
            </div>
          </Link>

          {/* Thumbnail */}
          {post.image && (
            <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
              <img
                src={post.image}
                alt="thumbnail"
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          {/* Pitch Details (Markdown) */}
          <section>
            <h3 className="text-2xl font-bold text-zinc-900 mb-6">The Pitch</h3>
            {parsedContent ? (
              <article
                className="prose prose-zinc max-w-none prose-headings:font-semibold prose-a:text-primary prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
            ) : (
              <p className="text-zinc-500 italic">No details provided.</p>
            )}
          </section>

          {/* Financial Charts */}
          <section className="space-y-8 pt-8 border-t border-zinc-100">
            <h3 className="text-2xl font-bold text-zinc-900 mb-6">Financial Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.growthData && post.growthData.length > 0 && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="text-sm font-semibold text-zinc-900 mb-4">Revenue vs Expenses</h4>
                  <RevenueVsExpensesChart growthData={post.growthData} theme={chartTheme} />
                </div>
              )}

              {post.fundingSources && post.fundingSources.length > 0 && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="text-sm font-semibold text-zinc-900 mb-4">Funding Sources</h4>
                  <FundingSourcesChart fundingSources={post.fundingSources} theme={chartTheme} />
                </div>
              )}

              {post.revenueByProduct && post.revenueByProduct.length > 0 && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="text-sm font-semibold text-zinc-900 mb-4">Revenue by Product</h4>
                  <RevenueByProductChart revenueByProduct={post.revenueByProduct} theme={chartTheme} />
                </div>
              )}

              {post.growthData && post.growthData.length > 0 && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="text-sm font-semibold text-zinc-900 mb-4">Revenue Growth</h4>
                  <GrowthChart growthData={post.growthData} theme={chartTheme} />
                </div>
              )}
            </div>
          </section>

          {/* Editor Picks */}
          {editorPosts.length > 0 && (
            <section className="pt-10 mt-10 border-t border-zinc-100">
              <h3 className="text-2xl font-bold text-zinc-900 mb-6">Editor Picks</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editorPosts.map((epost: StartupTypeCard, i: number) => (
                  <StartupCard key={i} post={epost} />
                ))}
              </ul>
            </section>
          )}

        </div>


        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            
            {/* Predictive Score Widget */}
            <StartupScoreClient post={post} />

            {/* AI Feedback Widget */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
              <AIFeedbackClient id={id} />
            </div>

            {/* Quick Metrics Widget */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50">
                <h3 className="font-semibold text-zinc-900 text-sm">Company Metrics</h3>
              </div>
              <div className="p-5 space-y-4">
                
                {post.stage && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <TrendingUp className="size-4" />
                      <span className="text-sm font-medium">Stage</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900">{post.stage}</span>
                  </div>
                )}
                
                {post.location && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <MapPin className="size-4" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900 text-right max-w-[120px] truncate" title={post.location}>{post.location}</span>
                  </div>
                )}
                
                {post.foundingYear && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Calendar className="size-4" />
                      <span className="text-sm font-medium">Founded</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900">{post.foundingYear}</span>
                  </div>
                )}
                
                {post.teamSize && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Users className="size-4" />
                      <span className="text-sm font-medium">Team Size</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900">{post.teamSize}</span>
                  </div>
                )}

                {post.revenue && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Briefcase className="size-4" />
                      <span className="text-sm font-medium">Revenue</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900">₹{post.revenue.toLocaleString()}</span>
                  </div>
                )}

                {post.funding && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <DollarSign className="size-4" />
                      <span className="text-sm font-medium">Funding</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900">₹{post.funding.toLocaleString()}</span>
                  </div>
                )}
                
                {post.valuation && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <TrendingUp className="size-4" />
                      <span className="text-sm font-medium">Valuation</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900">₹{post.valuation.toLocaleString()}</span>
                  </div>
                )}

                {post.website && (
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Globe className="size-4" />
                      <span className="text-sm font-medium">Website</span>
                    </div>
                    <Link href={post.website} target="_blank" className="text-sm font-semibold text-primary hover:underline truncate max-w-[120px]">
                      Visit Link
                    </Link>
                  </div>
                )}

              </div>
            </div>

            {/* Views Widget */}
            <Suspense fallback={<Skeleton className="h-14 w-full rounded-xl bg-zinc-100" />}>
              <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                 <span className="text-sm font-medium text-zinc-500">Total Views</span>
                 <View id={id} />
              </div>
            </Suspense>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;