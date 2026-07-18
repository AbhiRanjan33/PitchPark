import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be 100 characters or less"),
  description: z.string().min(20, "Description must be at least 20 characters").max(500, "Description must be 500 characters or less"),
  category: z.string().min(3, "Category must be at least 3 characters").max(20, "Category must be 20 characters or less"),
  link: z
    .string()
    .url("Must be a valid URL")
    .refine(async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        const contentType = res.headers.get("content-type");
        return contentType?.startsWith("image/");
      } catch {
        return false;
      }
    }, "URL must point to an image"),
  pitch: z.string().min(10, "Pitch must be at least 10 characters"),
  revenue: z.number().min(0, "Revenue cannot be negative").optional(),
  funding: z.number().min(0, "Funding cannot be negative").optional(),
  teamSize: z.number().min(1, "Team size must be at least 1").optional(),
  foundingYear: z.number().min(1900, "Year must be after 1900").max(2025, "Year cannot be in the future").optional(),
  location: z.string().max(100, "Location must be 100 characters or less").optional(),
  stage: z.enum(["Ideation", "Pre-Seed", "Seed", "Series A", "Series B"]).optional(),
  website: z.string().url("Must be a valid URL").optional(),
  valuation: z.number().min(0, "Valuation cannot be negative").optional(),
  growthData: z
    .array(
      z.object({
        year: z.number().int().min(1900, "Year must be after 1900").max(2025, "Year cannot be in the future"),
        revenue: z.number().min(0, "Revenue cannot be negative"),
        expenses: z.number().min(0, "Expenses cannot be negative"),
      })
    )
    .min(1, "At least one growth data point is required"),
  fundingSources: z
    .array(
      z.object({
        source: z.string().min(1, "Funding source is required"),
        amount: z.number().min(0, "Amount cannot be negative"),
      })
    )
    .min(1, "At least one funding source is required"),
  revenueByProduct: z
    .array(
      z.object({
        productName: z.string().min(1, "Product name is required"),
        revenue: z.number().min(0, "Revenue cannot be negative"),
      })
    )
    .min(1, "At least one revenue by product data point is required"),
});

export const investorFormSchema = z.object({
  numberOfInvestments: z
    .number()
    .int()
    .min(0, "Number of investments cannot be negative")
    .optional(),
  bestInvestments: z
    .array(z.string().min(1, "Investment name cannot be empty"))
    .optional(),
  yearsOfExperience: z
    .number()
    .int()
    .min(0, "Years of experience cannot be negative")
    .optional(),
  investmentTypes: z
    .array(z.string().min(1, "Investment type cannot be empty"))
    .optional(),
  investmentStage: z
    .array(z.string().min(1, "Investment stage cannot be empty"))
    .optional(),
  ticketSize: z
    .number()
    .min(0, "Ticket size cannot be negative")
    .optional(),
});