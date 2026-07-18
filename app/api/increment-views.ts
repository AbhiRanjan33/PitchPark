import { NextApiRequest, NextApiResponse } from "next";
import { writeClient } from "@/sanity/lib/write-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing startup ID" });
  }

  try {
    // Fetch current view count
    const { views: totalViews } = await writeClient
      .withConfig({ useCdn: false })
      .fetch(`*[_type == "startup" && _id == $id][0]{ views }`, { id });

    const currentViews = totalViews || 0;

    // Increment view count
    await writeClient
      .patch(id)
      .set({ views: currentViews + 1 })
      .commit();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return res.status(500).json({ error: "Failed to increment views" });
  }
}