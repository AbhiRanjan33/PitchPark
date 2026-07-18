"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send, Plus, Trash2 } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const [growthData, setGrowthData] = useState<{ year: number; revenue: number; expenses: number }[]>([
    { year: new Date().getFullYear(), revenue: 0, expenses: 0 },
  ]);
  const [fundingSources, setFundingSources] = useState<{ source: string; amount: number }[]>([
    { source: "", amount: 0 },
  ]);
  const [revenueByProduct, setRevenueByProduct] = useState<{ productName: string; revenue: number }[]>([
    { productName: "", revenue: 0 },
  ]);
  const { toast } = useToast();
  const router = useRouter();

  // Growth Data Handlers
  const addGrowthDataPoint = () => {
    setGrowthData([...growthData, { year: new Date().getFullYear(), revenue: 0, expenses: 0 }]);
  };

  const removeGrowthDataPoint = (index: number) => {
    setGrowthData(growthData.filter((_, i) => i !== index));
  };

  const updateGrowthDataPoint = (index: number, field: "year" | "revenue" | "expenses", value: string) => {
    const updatedData = [...growthData];
    updatedData[index] = { ...updatedData[index], [field]: Number(value) };
    setGrowthData(updatedData);
  };

  // Funding Sources Handlers
  const addFundingSource = () => {
    setFundingSources([...fundingSources, { source: "", amount: 0 }]);
  };

  const removeFundingSource = (index: number) => {
    setFundingSources(fundingSources.filter((_, i) => i !== index));
  };

  const updateFundingSource = (index: number, field: "source" | "amount", value: string) => {
    const updatedData = [...fundingSources];
    updatedData[index] = { ...updatedData[index], [field]: field === "source" ? value : Number(value) };
    setFundingSources(updatedData);
  };

  // Revenue by Product Handlers
  const addRevenueByProduct = () => {
    setRevenueByProduct([...revenueByProduct, { productName: "", revenue: 0 }]);
  };

  const removeRevenueByProduct = (index: number) => {
    setRevenueByProduct(revenueByProduct.filter((_, i) => i !== index));
  };

  const updateRevenueByProduct = (index: number, field: "productName" | "revenue", value: string) => {
    const updatedData = [...revenueByProduct];
    updatedData[index] = { ...updatedData[index], [field]: field === "productName" ? value : Number(value) };
    setRevenueByProduct(updatedData);
  };

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
        revenue: formData.get("revenue") ? Number(formData.get("revenue")) : null,
        funding: formData.get("funding") ? Number(formData.get("funding")) : null,
        teamSize: formData.get("teamSize") ? Number(formData.get("teamSize")) : null,
        foundingYear: formData.get("foundingYear") ? Number(formData.get("foundingYear")) : null,
        location: formData.get("location") as string,
        stage: formData.get("stage") as string,
        website: formData.get("website") as string,
        valuation: formData.get("valuation") ? Number(formData.get("valuation")) : null,
        growthData,
        fundingSources,
        revenueByProduct,
      };

      console.log("Form values:", formValues);
      await formSchema.parseAsync(formValues);

      const result = await createPitch(prevState, formData, pitch, growthData, fundingSources, revenueByProduct, formValues.valuation);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your startup pitch has been created successfully",
        });
        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }
      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });
      return { ...prevState, error: "An unexpected error has occurred", status: "ERROR" };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">Title</label>
        <Input id="title" name="title" className="startup-form_input" required placeholder="Startup Title" />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">Description</label>
        <Textarea id="description" name="description" className="startup-form_textarea" required placeholder="Startup Description" />
        {errors.description && <p className="startup-form_error">{errors.description}</p>}
      </div>
      <div>
        <label htmlFor="category" className="startup-form_label">Category</label>
        <Input id="category" name="category" className="startup-form_input" required placeholder="Startup Category (Tech, Health, Education...)" />
        {errors.category && <p className="startup-form_error">{errors.category}</p>}
      </div>
      <div>
        <label htmlFor="link" className="startup-form_label">Image URL</label>
        <Input id="link" name="link" className="startup-form_input" required placeholder="Startup Image URL" />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>
      <div>
        <label htmlFor="revenue" className="startup-form_label">Annual Revenue (INR)</label>
        <Input id="revenue" name="revenue" type="number" className="startup-form_input" placeholder="50000" />
        {errors.revenue && <p className="startup-form_error">{errors.revenue}</p>}
      </div>
      <div>
        <label htmlFor="funding" className="startup-form_label">Funding Raised (INR)</label>
        <Input id="funding" name="funding" type="number" className="startup-form_input" placeholder="1000000" />
        {errors.funding && <p className="startup-form_error">{errors.funding}</p>}
      </div>
      <div>
        <label htmlFor="teamSize" className="startup-form_label">Team Size</label>
        <Input id="teamSize" name="teamSize" type="number" className="startup-form_input" placeholder="5" />
        {errors.teamSize && <p className="startup-form_error">{errors.teamSize}</p>}
      </div>
      <div>
        <label htmlFor="foundingYear" className="startup-form_label">Founding Year</label>
        <Input id="foundingYear" name="foundingYear" type="number" className="startup-form_input" placeholder="2023" />
        {errors.foundingYear && <p className="startup-form_error">{errors.foundingYear}</p>}
      </div>
      <div>
        <label htmlFor="location" className="startup-form_label">Location</label>
        <Input id="location" name="location" className="startup-form_input" placeholder="New Delhi, India" />
        {errors.location && <p className="startup-form_error">{errors.location}</p>}
      </div>
      <div>
        <label htmlFor="stage" className="startup-form_label">Stage</label>
        <select id="stage" name="stage" className="startup-form_input">
          <option value="">Select Stage</option>
          <option value="Ideation">Ideation</option>
          <option value="Pre-Seed">Pre-Seed</option>
          <option value="Seed">Seed</option>
          <option value="Series A">Series A</option>
          <option value="Series B">Series B</option>
        </select>
        {errors.stage && <p className="startup-form_error">{errors.stage}</p>}
      </div>
      <div>
        <label htmlFor="website" className="startup-form_label">Website URL</label>
        <Input id="website" name="website" className="startup-form_input" placeholder="https://example.com" />
        {errors.website && <p className="startup-form_error">{errors.website}</p>}
      </div>
      <div>
        <label htmlFor="valuation" className="startup-form_label">Startup Valuation (INR)</label>
        <Input id="valuation" name="valuation" type="number" className="startup-form_input" placeholder="5000000" />
        {errors.valuation && <p className="startup-form_error">{errors.valuation}</p>}
      </div>
      <div>
        <label className="startup-form_label">Revenue Growth Over Time (Revenue VS Expenses)</label>
        {growthData.map((data, index) => (
          <div key={index} className="flex gap-4 mb-4 items-center">
            <Input
              type="number"
              placeholder="Year"
              value={data.year}
              onChange={(e) => updateGrowthDataPoint(index, "year", e.target.value)}
              className="startup-form_input"
            />
            <Input
              type="number"
              placeholder="Revenue (INR)"
              value={data.revenue}
              onChange={(e) => updateGrowthDataPoint(index, "revenue", e.target.value)}
              className="startup-form_input"
            />
            <Input
              type="number"
              placeholder="Expenses (INR)"
              value={data.expenses}
              onChange={(e) => updateGrowthDataPoint(index, "expenses", e.target.value)}
              className="startup-form_input"
            />
            {growthData.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeGrowthDataPoint(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addGrowthDataPoint}>
          <Plus className="size-4 mr-2" /> Add Data Point
        </Button>
        {errors.growthData && <p className="startup-form_error">{errors.growthData}</p>}
      </div>
      <div>
        <label className="startup-form_label">Funding Sources</label>
        {fundingSources.map((source, index) => (
          <div key={index} className="flex gap-4 mb-4 items-center">
            <Input
              type="text"
              placeholder="Source (e.g., Venture Capital)"
              value={source.source}
              onChange={(e) => updateFundingSource(index, "source", e.target.value)}
              className="startup-form_input"
            />
            <Input
              type="number"
              placeholder="Amount (INR)"
              value={source.amount}
              onChange={(e) => updateFundingSource(index, "amount", e.target.value)}
              className="startup-form_input"
            />
            {fundingSources.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeFundingSource(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addFundingSource}>
          <Plus className="size-4 mr-2" /> Add Funding Source
        </Button>
        {errors.fundingSources && <p className="startup-form_error">{errors.fundingSources}</p>}
      </div>
      <div>
        <label className="startup-form_label">Revenue by Product/Service</label>
        {revenueByProduct.map((data, index) => (
          <div key={index} className="flex gap-4 mb-4 items-center">
            <Input
              type="text"
              placeholder="Product Name"
              value={data.productName}
              onChange={(e) => updateRevenueByProduct(index, "productName", e.target.value)}
              className="startup-form_input"
            />
            <Input
              type="number"
              placeholder="Revenue (INR)"
              value={data.revenue}
              onChange={(e) => updateRevenueByProduct(index, "revenue", e.target.value)}
              className="startup-form_input"
            />
            {revenueByProduct.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeRevenueByProduct(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addRevenueByProduct}>
          <Plus className="size-4 mr-2" /> Add Revenue Data Point
        </Button>
        {errors.revenueByProduct && <p className="startup-form_error">{errors.revenueByProduct}</p>}
      </div>
      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">Pitch</label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{ placeholder: "Briefly describe your idea and what problem it solves" }}
          previewOptions={{ disallowedElements: ["style"] }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>
      <Button type="submit" className="startup-form_btn text-white" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;