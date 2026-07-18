'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const StartupScoreClient = ({ post }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchScore = async () => {
    setLoading(true);
    setError(null);

    // Prepare the data to send to the Node.js server
    const inputData = {
      Category: post.category,
      "Annual Revenue (INR)": post.revenue,
      "Funding Raised (INR)": post.funding,
      "Team Size": post.teamSize,
      "Founding Year": post.foundingYear,
      Location: post.location,
      "Startup Valuation (INR)": post.valuation,
      "Revenue Growth Over Time (Revenue VS Expenses)": post.growthData
        ? post.growthData.reduce((acc, curr) => acc + (curr.revenue - curr.expenses), 0) / post.growthData.length
        : 0,
      "Funding Sources": post.fundingSources ? post.fundingSources[0]?.source : "Unknown",
      "Revenue by Product/Service": post.revenueByProduct
        ? post.revenueByProduct.reduce((acc, curr) => acc + curr.revenue, 0)
        : 0,
    };

    console.log('Sending input data to backend:', inputData);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to fetch score');
      }

      const data = await response.json();
      console.log('Response data:', data);

      // Use data.prediction instead of data["Invest or Not Score"]
      const score = data.prediction;
      if (typeof score !== 'number' || isNaN(score)) {
        throw new Error('Invalid score received from backend');
      }

      // Redirect to score page with score as query parameter
      router.push(`/startup/${post._id}/score?score=${score}`);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch startup score. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 flex justify-center">
      <Button
        onClick={fetchScore}
        disabled={loading}
        className="btn-primary text-white"
      >
        {loading ? "Fetching Score..." : "Get Startup Score"}
      </Button>
      {error && (
        <p className="mt-3 text-red-500 text-16-medium">{error}</p>
      )}
    </div>
  );
};

export default StartupScoreClient;