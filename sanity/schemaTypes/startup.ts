import { defineField, defineType } from "sanity";
import { defineQuery } from "next-sanity";

export const startup = defineType({
  name: "startup",
  title: "Startup",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "views",
      type: "number",
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "category",
      type: "string",
      validation: (Rule) =>
        Rule.min(1).max(20).required().error("Please enter a category"),
    }),
    defineField({
      name: "image",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pitch",
      type: "markdown",
    }),
    defineField({
      name: "revenue",
      type: "number",
      description: "Annual revenue in INR",
    }),
    defineField({
      name: "funding",
      type: "number",
      description: "Total funding raised in INR",
    }),
    defineField({
      name: "teamSize",
      type: "number",
      description: "Number of team members",
    }),
    defineField({
      name: "foundingYear",
      type: "number",
      description: "Year the startup was founded",
    }),
    defineField({
      name: "location",
      type: "string",
      description: "Geographic location (e.g., New Delhi, India)",
    }),
    defineField({
      name: "stage",
      type: "string",
      options: {
        list: [
          { title: "Ideation", value: "Ideation" },
          { title: "Pre-Seed", value: "Pre-Seed" },
          { title: "Seed", value: "Seed" },
          { title: "Series A", value: "Series A" },
          { title: "Series B", value: "Series B" },
        ],
      },
      description: "Current stage of the startup",
    }),
    defineField({
      name: "website",
      type: "url",
      description: "Official website URL",
    }),
    defineField({
      name: "valuation",
      type: "number",
      description: "Startup valuation in INR",
    }),
    defineField({
      name: "growthData",
      title: "Growth Data",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "year",
              title: "Year",
              type: "number",
              validation: (Rule) => Rule.required().min(1900).max(2025),
            }),
            defineField({
              name: "revenue",
              title: "Revenue",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "expenses",
              title: "Expenses",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
        },
      ],
      description: "Historical revenue and expenses data by year",
    }),
    defineField({
      name: "fundingSources",
      title: "Funding Sources",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "source",
              title: "Source",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "amount",
              title: "Amount",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
        },
      ],
      description: "Breakdown of funding by source",
    }),
  defineField({
      name: "revenueByProduct",
      title: "Revenue by Product/Service",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "productName",
              title: "Product Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "revenue",
              title: "Revenue",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
        },
      ],
      description: "Revenue breakdown by product/service",
    }),
  defineField({
      name: "aiFeedback",
      title: "AI Feedback",
      type: "text",
      description: "AI-generated feedback for the startup",
    }),
  ],
});

export const STARTUPS_QUERY = defineQuery(`
  *[_type == "startup" && defined(slug.current) && (!defined($search) || title match $search || category match $search || author->name match $search)] | order(_createdAt desc) {
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    }, 
    views,
    description,
    category,
    image,
    revenue,
    funding,
    teamSize,
    foundingYear,
    location,
    stage,
    website,
    growthData
  }
`);

export const STARTUP_BY_ID_QUERY = defineQuery(`
  *[_type == "startup" && _id == $id][0]{
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, username, image, bio
    }, 
    views,
    description,
    category,
    image,
    pitch,
    revenue,
    funding,
    teamSize,
    foundingYear,
    location,
    stage,
    website,
    growthData
  }
`);

export const STARTUP_VIEWS_QUERY = defineQuery(`
  *[_type == "startup" && _id == $id][0]{
    _id, views
  }
`);

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
  *[_type == "author" && id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
  }
`);

export const AUTHOR_BY_ID_QUERY = defineQuery(`
  *[_type == "author" && _id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
  }
`);