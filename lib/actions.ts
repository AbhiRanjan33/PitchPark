"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string,
  growthData: { year: number; revenue: number; expenses: number }[] = [],
  fundingSources: { source: string; amount: number }[] = [],
  revenueByProduct: { productName: string; revenue: number }[] = [],
  valuation?: number
) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  const {
    title,
    description,
    category,
    link,
    revenue,
    funding,
    teamSize,
    foundingYear,
    location,
    stage,
    website,
  } = Object.fromEntries(form);

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      _type: "startup",
      title,
      description,
      category,
      image: link,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
      revenue: revenue ? Number(revenue) : undefined,
      funding: funding ? Number(funding) : undefined,
      teamSize: teamSize ? Number(teamSize) : undefined,
      foundingYear: foundingYear ? Number(foundingYear) : undefined,
      location,
      stage,
      website,
      valuation: valuation ? Number(valuation) : undefined,
      growthData: growthData.length > 0 ? growthData : undefined,
      fundingSources: fundingSources.length > 0 ? fundingSources : undefined,
      revenueByProduct: revenueByProduct.length > 0 ? revenueByProduct : undefined,
    };

    const result = await writeClient.create(startup);
    console.log("Created startup:", result);
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error creating startup:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const updateInvestorProfile = async (
  state: any,
  formData: {
    numberOfInvestments?: number;
    bestInvestments?: string[];
    yearsOfExperience?: number;
    investmentTypes?: string[];
    investmentStage?: string[];
    ticketSize?: number;
  }
) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  if (session.user.role !== "investor")
    return parseServerActionResponse({
      error: "Unauthorized: Not an investor",
      status: "ERROR",
    });

  try {
    const patchData = {
      numberOfInvestments: formData.numberOfInvestments,
      bestInvestments: formData.bestInvestments?.filter(Boolean) || [],
      yearsOfExperience: formData.yearsOfExperience,
      investmentTypes: formData.investmentTypes?.filter(Boolean) || [],
      investmentStage: formData.investmentStage?.filter(Boolean) || [],
      ticketSize: formData.ticketSize,
    };

    const result = await writeClient
      .patch(session.id)
      .set(patchData)
      .commit();

    console.log("Updated investor profile:", result);
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error updating investor profile:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};