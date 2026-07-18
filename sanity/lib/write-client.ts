import "server-only";

import { createClient } from "next-sanity";

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p02ozpp3",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "newest",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03", // Use a stable version
  useCdn: false, // Mutations require real-time API
  token: process.env.SANITY_WRITE_TOKEN, // Use write token
});

// Validate token presence
if (!writeClient.config().token) {
  throw new Error(
    "Sanity write token not found. Ensure SANITY_WRITE_TOKEN is set in .env.local",
  );
}