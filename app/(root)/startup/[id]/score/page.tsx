import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ScorePage = async ({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ score?: string }> }) => {
  const { id } = await params;
  const { score } = await searchParams;

  // Fetch startup data
  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });
  if (!post) return notFound();

  // Parse score
  const scoreValue = parseFloat(score || "0");
  let scoreColor = "gray";
  let scoreLabel = "Unknown";
  let scoreDescription = "No score available. Please try fetching the score again.";

  // Calculate color and description based on score (0–10 scale)
  if (!isNaN(scoreValue) && scoreValue >= 0 && scoreValue <= 10) {
    if (scoreValue <= 4) {
      const red = 255;
      const greenBlue = Math.round((scoreValue / 4) * 128);
      scoreColor = `rgb(${red}, ${greenBlue}, ${greenBlue})`;
      scoreLabel = "Bad";
      scoreDescription = "This startup's score indicates significant risks or challenges. Investors may want to proceed with caution and conduct thorough due diligence.";
    } else if (scoreValue <= 7) {
      const r = Math.round(255 - ((scoreValue - 4) / 3) * 51);
      const g = Math.round(255 - ((scoreValue - 4) / 3) * 51);
      const b = Math.round(128 - ((scoreValue - 4) / 3) * 128);
      scoreColor = `rgb(${r}, ${g}, ${b})`;
      scoreLabel = "Average";
      scoreDescription = "This startup shows moderate potential. It has some strengths but also areas that need improvement. Consider exploring further details before investing.";
    } else {
      const r = Math.round(128 - ((scoreValue - 7) / 3) * 128);
      const g = Math.round(255 - ((scoreValue - 7) / 3) * 127);
      const b = Math.round(128 - ((scoreValue - 7) / 3) * 128);
      scoreColor = `rgb(${r}, ${g}, ${b})`;
      scoreLabel = "Good";
      scoreDescription = "This startup demonstrates strong potential for investment. It has solid fundamentals and promising growth prospects. A great opportunity for investors!";
    }
  }

  // Features used for prediction
  const predictionFeatures = {
    Category: post.category || "N/A",
    "Annual Revenue (INR)": post.revenue ? `₹${post.revenue.toLocaleString()}` : "N/A",
    "Funding Raised (INR)": post.funding ? `₹${post.funding.toLocaleString()}` : "N/A",
    "Team Size": post.teamSize || "N/A",
    "Founding Year": post.foundingYear || "N/A",
    Location: post.location || "N/A",
    "Startup Valuation (INR)": post.valuation ? `₹${post.valuation.toLocaleString()}` : "N/A",
    "Revenue Growth Over Time": post.growthData
      ? `₹${(post.growthData.reduce((acc, curr) => acc + (curr.revenue - curr.expenses), 0) / post.growthData.length).toLocaleString()}`
      : "N/A",
    "Funding Sources": post.fundingSources ? post.fundingSources[0]?.source : "Unknown",
    "Revenue by Product/Service": post.revenueByProduct
      ? `₹${post.revenueByProduct.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}`
      : "N/A",
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">{post.title} - Investment Score</h1>
        <p className="sub-heading !max-w-5xl">See how this startup ranks for investment potential</p>
      </section>

      <section className="section_container max-w-4xl mx-auto">
        {/* Score Display */}
        <div className="text-center mb-10 section-card p-6 pattern">
          <div
            className="inline-block text-white text-4xl font-bold py-4 px-8 rounded-xl shadow-lg"
            style={{ backgroundColor: scoreColor }}
          >
            {isNaN(scoreValue) ? "N/A" : scoreValue.toFixed(2)}
          </div>
          <p className="text-30-semibold mt-4">{scoreLabel} Investment Score</p>
          <p className="text-16-medium mt-4 max-w-2xl mx-auto">{scoreDescription}</p>
        </div>

        {/* Features Considered */}
        <div className="mb-10 section-card p-6">
          <h3 className="text-30-semibold mb-4">Features Considered for Score</h3>
          <p className="text-16-medium mb-4">
            The investment score is calculated based on the following key startup metrics:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-16-medium">
            {Object.entries(predictionFeatures).map(([key, value]) => (
              <p key={key}>
                <span className="font-semibold">{key}:</span> {value}
              </p>
            ))}
          </div>
        </div>

        {/* Startup Summary */}
        <div className="mb-10 section-card p-6">
          <h3 className="text-30-semibold mb-4">Startup Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-16-medium">
            <p><span className="font-semibold">Category:</span> {post.category || "N/A"}</p>
            <p><span className="font-semibold">Location:</span> {post.location || "N/A"}</p>
            <p><span className="font-semibold">Founded:</span> {post.foundingYear || "N/A"}</p>
            <p><span className="font-semibold">Team Size:</span> {post.teamSize || "N/A"}</p>
            <p><span className="font-semibold">Total Revenue:</span> ₹{post.revenue ? post.revenue.toLocaleString() : "N/A"}</p>
            <p><span className="font-semibold">Funding:</span> ₹{post.funding ? post.funding.toLocaleString() : "N/A"}</p>
            <p><span className="font-semibold">Valuation:</span> ₹{post.valuation ? post.valuation.toLocaleString() : "N/A"}</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Link href={`/startup/${id}`}>
            <Button className="btn-primary">Back to Startup Details</Button>
          </Link>
        </div>
      </section>
    </Suspense>
  );
};

export default ScorePage;