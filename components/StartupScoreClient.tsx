'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Activity, Loader2 } from "lucide-react";
import { Author, Startup } from "@/sanity/types";

type StartupScoreClientProps = {
  post: Omit<Startup, "author"> & {
    revenue?: number;
    funding?: number;
    teamSize?: number;
    foundingYear?: number;
    location?: string;
    growthData?: any[];
    fundingSources?: any[];
    revenueByProduct?: any[];
  };
};

const StartupScoreClient = ({ post }: StartupScoreClientProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchScore = async () => {
    setLoading(true);
    setError(null);

    const inputData = {
      Category: post.category,
      "Annual Revenue (INR)": post.revenue || 0,
      "Funding Raised (INR)": post.funding || 0,
      "Team Size": post.teamSize || 1,
      "Founding Year": post.foundingYear || new Date().getFullYear(),
      Location: post.location || "Unknown",
      "Startup Valuation (INR)": post.valuation || 0,
      "Revenue Growth Over Time (Revenue VS Expenses)": post.growthData
        ? post.growthData.reduce((acc, curr) => acc + (curr.revenue - curr.expenses), 0) / post.growthData.length
        : 0,
      "Funding Sources": post.fundingSources && post.fundingSources.length > 0 ? post.fundingSources[0]?.source : "Unknown",
      "Revenue by Product/Service": post.revenueByProduct
        ? post.revenueByProduct.reduce((acc, curr) => acc + curr.revenue, 0)
        : 0,
    };

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch score');
      }

      const data = await response.json();
      const score = data.prediction;

      if (typeof score !== 'number' || isNaN(score)) {
        throw new Error('Invalid score received from backend');
      }

      router.push(`/startup/${post._id}/score?score=${score}`);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch startup score. Ensure backend is running.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Brain className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 text-sm">Predictive Analytics</h3>
          <p className="text-xs text-zinc-500">ML-powered success metric</p>
        </div>
      </div>
      
      <div className="mb-4 text-sm text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
        This model evaluates revenue, team size, location, and funding data to predict startup viability.
      </div>

      <button
        onClick={fetchScore}
        disabled={loading}
        className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Computing...
          </>
        ) : (
          <>
            <Activity className="size-4" />
            Generate Startup Score
          </>
        )}
      </button>

      {error && (
        <p className="mt-3 text-red-500 text-xs font-medium text-center">{error}</p>
      )}
    </div>
  );
};

export default StartupScoreClient;