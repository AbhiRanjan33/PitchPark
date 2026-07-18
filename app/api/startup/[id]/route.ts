import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";

// Utility function to extract the final output from the model's response
function extractFinalOutput(text: string): string {
  const marker = "Final Answer:";
  const index = text.indexOf(marker);
  if (index !== -1) {
    return text.slice(index + marker.length).trim();
  }
  return text.trim();
}

// Utility function to format startup data into a string for AI analysis
function formatStartupData(post: any): string {
  const {
    title,
    description,
    category,
    pitch,
    revenue,
    funding,
    teamSize,
    foundingYear,
    location,
    stage,
    website,
    valuation,
    growthData,
    fundingSources,
    revenueByProduct,
  } = post;

  const formattedGrowthData = growthData?.length
    ? growthData
        .map(
          (data: { year: number; revenue: number; expenses: number }) =>
            `Year: ${data.year}, Revenue: ₹${data.revenue.toLocaleString()}, Expenses: ₹${data.expenses.toLocaleString()}`
        )
        .join("; ")
    : "No growth data available.";

  const formattedFundingSources = fundingSources?.length
    ? fundingSources
        .map(
          (source: { source: string; amount: number }) =>
            `Source: ${source.source}, Amount: ₹${source.amount.toLocaleString()}`
        )
        .join("; ")
    : "No funding sources available.";

  const formattedRevenueByProduct = revenueByProduct?.length
    ? revenueByProduct
        .map(
          (product: { productName: string; revenue: number }) =>
            `Product: ${product.productName}, Revenue: ₹${product.revenue.toLocaleString()}`
        )
        .join("; ")
    : "No revenue by product available.";

  return `
    Startup Title: ${title || "Not provided"}
    Description: ${description || "Not provided"}
    Category: ${category || "Not provided"}
    Pitch: ${pitch || "Not provided"}
    Annual Revenue: ${revenue ? `₹${revenue.toLocaleString()}` : "Not provided"}
    Total Funding: ${funding ? `₹${funding.toLocaleString()}` : "Not provided"}
    Team Size: ${teamSize || "Not provided"}
    Founding Year: ${foundingYear || "Not provided"}
    Location: ${location || "Not provided"}
    Stage: ${stage || "Not provided"}
    Website: ${website || "Not provided"}
    Valuation: ${valuation ? `₹${valuation.toLocaleString()}` : "Not provided"}
    Growth Data: ${formattedGrowthData}
    Funding Sources: ${formattedFundingSources}
    Revenue by Product/Service: ${formattedRevenueByProduct}
  `;
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Fetch the startup data from Sanity using the ID
    const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

    if (!post) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    console.log("Fetched startup data:", post);

    // Check if AI feedback already exists
    if (post.aiFeedback) {
      return NextResponse.json({ result: post.aiFeedback });
    }

    // Format the startup data for AI analysis
    const startupText = formatStartupData(post);
    console.log("Formatted startup data for AI:", startupText);

    // Validate API Key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouter API key is missing in environment variables.");
    }

    // Prepare the prompt for the AI model
    const prompt = `
      You are an expert business analyst. Analyze the following startup data and provide detailed feedback on its strengths, weaknesses, potential risks, and recommendations for improvement. Be specific and actionable in your feedback.

      ${startupText}

      Provide your analysis and feedback below:
    `;

    // Call the OpenRouter API with a different model
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3.1-8b-instruct:free", // Updated to a free-tier model
        "messages": [
          {
            "role": "user",
            "content": prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Full API response:", JSON.stringify(data, null, 2));
    const rawOutput = data.choices?.[0]?.message?.content || "No response from model.";
    const aiFeedback = extractFinalOutput(rawOutput);

    // Save the AI feedback to Sanity
    await writeClient.patch(id).set({ aiFeedback }).commit();
    console.log("Saved AI feedback to Sanity:", aiFeedback);

    return NextResponse.json({ result: aiFeedback });
  } catch (error) {
    console.error("Error in AI Feedback API:", error);
    return NextResponse.json({ error: "Failed to fetch AI feedback" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Fetch the startup data from Sanity to get the AI feedback
    const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

    if (!post) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    if (!post.aiFeedback) {
      return NextResponse.json(
        { error: "No AI feedback available. Submit a POST request to generate feedback." },
        { status: 404 }
      );
    }

    return NextResponse.json({ result: post.aiFeedback });
  } catch (error) {
    console.error("Error retrieving AI feedback:", error);
    return NextResponse.json({ error: "Failed to retrieve AI feedback" }, { status: 500 });
  }
}