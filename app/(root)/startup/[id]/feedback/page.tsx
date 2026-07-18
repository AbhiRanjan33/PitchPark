import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
}

async function fetchAIFeedback(id: string) {
  try {
    const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });
    if (!post) {
      throw new Error("Startup not found");
    }

    if (post.aiFeedback) {
      return post.aiFeedback;
    }

    const baseUrl = getBaseUrl();
    const apiUrl = `${baseUrl}/api/startup/${id}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to generate AI feedback");
    }

    const data = await response.json();
    return data.result || "No feedback available";
  } catch (error) {
    console.error("Error fetching AI feedback:", error);
    return "Unable to fetch AI feedback at this time.";
  }
}

const FeedbackPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });
  if (!post) return notFound();

  const aiFeedback = await fetchAIFeedback(id);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">AI Feedback for {post.title}</h1>
        <p className="sub-heading !max-w-5xl">Analysis and recommendations for this startup</p>
      </section>

      <section className="section_container max-w-4xl mx-auto">
        <div className="section-card p-6">
          <h2 className="text-30-semibold mb-4">AI Analysis & Recommendations</h2>
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <p className="text-16-medium leading-relaxed whitespace-pre-wrap">
              {aiFeedback}
            </p>
          </Suspense>
        </div>

        <div className="mt-10 flex justify-center">
          <Link href={`/startup/${id}`}>
            <Button className="btn-primary">Back to Startup Details</Button>
          </Link>
        </div>
      </section>
    </Suspense>
  );
};

export default FeedbackPage;