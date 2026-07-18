import { defineField, defineType } from "sanity";
import { UserIcon } from "lucide-react";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "id",
      type: "number",
    }),
    defineField({
      name: "name",
      type: "string",
    }),
    defineField({
      name: "username",
      type: "string",
    }),
    defineField({
      name: "email",
      type: "string",
    }),
    defineField({
      name: "image",
      type: "url",
    }),
    defineField({
      name: "bio",
      type: "text",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Investor", value: "investor" },
          { title: "Startup Founder", value: "startup-founder" },
          { title: "User", value: "user" },
        ],
        layout: "radio", // Optional: displays options as radio buttons in the Sanity Studio
      },
      initialValue: "user", // Default value if none is provided
      validation: (Rule) => Rule.required(), // Optional: makes the field required
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role", // Optional: shows the role in the preview
    },
  },
});import { defineField, defineType } from "sanity";
import { UserIcon } from "lucide-react";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "id",
      type: "number",
    }),
    defineField({
      name: "name",
      type: "string",
    }),
    defineField({
      name: "username",
      type: "string",
    }),
    defineField({
      name: "email",
      type: "string",
    }),
    defineField({
      name: "image",
      type: "url",
    }),
    defineField({
      name: "bio",
      type: "text",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Investor", value: "investor" },
          { title: "Startup Founder", value: "startup-founder" },
          { title: "User", value: "user" },
        ],
        layout: "radio",
      },
      initialValue: "user",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "numberOfInvestments",
      title: "Number of Investments",
      type: "number",
    }),
    defineField({
      name: "bestInvestments",
      title: "Best Investments",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "yearsOfExperience",
      title: "Years of Experience",
      type: "number",
    }),
    defineField({
      name: "investmentTypes",
      title: "Type of Investments",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: ["Angel", "Venture Capital", "Private Equity", "Other"],
      },
    }),
    defineField({
      name: "investmentStage",
      title: "Investment Stage",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: ["Pre-Seed", "Seed", "Series A", "Series B", "Other"],
      },
    }),
    defineField({
      name: "ticketSize",
      title: "Ticket Size (INR)",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
    },
  },
});