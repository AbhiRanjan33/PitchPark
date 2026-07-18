"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send, Plus, Trash2, Info } from "lucide-react";
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
    <form action={formAction} className="max-w-3xl mx-auto my-12 space-y-8">
      
      {/* Section 1: Basic Info */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-zinc-900 mb-6 border-b border-zinc-100 pb-4">1. Basic Information</h2>
        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="startup-form_label">Startup Name</label>
            <Input id="title" name="title" className="startup-form_input" required placeholder="e.g. PitchPark" />
            {errors.title && <p className="startup-form_error">{errors.title}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="startup-form_label">Tagline / Short Description</label>
            <Textarea id="description" name="description" className="startup-form_textarea" required placeholder="A brief 1-2 sentence description of what you do." />
            {errors.description && <p className="startup-form_error">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="category" className="startup-form_label">Category</label>
              <Input id="category" name="category" className="startup-form_input" required placeholder="e.g. SaaS, FinTech, HealthTech" />
              {errors.category && <p className="startup-form_error">{errors.category}</p>}
            </div>
            <div>
              <label htmlFor="stage" className="startup-form_label">Stage</label>
              <select id="stage" name="stage" className="startup-form_input bg-white w-full">
                <option value="">Select Stage</option>
                <option value="Ideation">Ideation</option>
                <option value="Pre-Seed">Pre-Seed</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
              </select>
              {errors.stage && <p className="startup-form_error">{errors.stage}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="foundingYear" className="startup-form_label">Founding Year</label>
              <Input id="foundingYear" name="foundingYear" type="number" className="startup-form_input" placeholder="e.g. 2023" />
              {errors.foundingYear && <p className="startup-form_error">{errors.foundingYear}</p>}
            </div>
            <div>
              <label htmlFor="location" className="startup-form_label">Location</label>
              <Input id="location" name="location" className="startup-form_input" placeholder="e.g. San Francisco, CA" />
              {errors.location && <p className="startup-form_error">{errors.location}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="website" className="startup-form_label">Website URL</label>
              <Input id="website" name="website" className="startup-form_input" placeholder="https://yourstartup.com" />
              {errors.website && <p className="startup-form_error">{errors.website}</p>}
            </div>
            <div>
              <label htmlFor="link" className="startup-form_label">Thumbnail Image URL</label>
              <Input id="link" name="link" className="startup-form_input" required placeholder="https://..." />
              {errors.link && <p className="startup-form_error">{errors.link}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: ML & Financial Data */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-start justify-between border-b border-zinc-100 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 mb-1">2. Financials & Metrics</h2>
            <p className="text-sm text-zinc-500">This data is used by our Machine Learning model to calculate your Startup Score.</p>
          </div>
          <div className="p-2 bg-indigo-50 text-primary rounded-lg hidden sm:block">
            <Info className="size-5" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="revenue" className="startup-form_label">Annual Revenue (INR)</label>
              <Input id="revenue" name="revenue" type="number" className="startup-form_input" placeholder="e.g. 5000000" />
              {errors.revenue && <p className="startup-form_error">{errors.revenue}</p>}
            </div>
            <div>
              <label htmlFor="funding" className="startup-form_label">Total Funding Raised (INR)</label>
              <Input id="funding" name="funding" type="number" className="startup-form_input" placeholder="e.g. 15000000" />
              {errors.funding && <p className="startup-form_error">{errors.funding}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="valuation" className="startup-form_label">Current Valuation (INR)</label>
              <Input id="valuation" name="valuation" type="number" className="startup-form_input" placeholder="e.g. 100000000" />
              {errors.valuation && <p className="startup-form_error">{errors.valuation}</p>}
            </div>
            <div>
              <label htmlFor="teamSize" className="startup-form_label">Team Size</label>
              <Input id="teamSize" name="teamSize" type="number" className="startup-form_input" placeholder="e.g. 12" />
              {errors.teamSize && <p className="startup-form_error">{errors.teamSize}</p>}
            </div>
          </div>

          {/* Complex Fields */}
          <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100">
            <label className="startup-form_label block mb-3 text-zinc-800">Historical Growth (Revenue vs Expenses)</label>
            {growthData.map((data, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 mb-3">
                <Input
                  type="number"
                  placeholder="Year"
                  value={data.year}
                  onChange={(e) => updateGrowthDataPoint(index, "year", e.target.value)}
                  className="startup-form_input !mt-0 flex-1"
                />
                <Input
                  type="number"
                  placeholder="Revenue"
                  value={data.revenue}
                  onChange={(e) => updateGrowthDataPoint(index, "revenue", e.target.value)}
                  className="startup-form_input !mt-0 flex-1"
                />
                <Input
                  type="number"
                  placeholder="Expenses"
                  value={data.expenses}
                  onChange={(e) => updateGrowthDataPoint(index, "expenses", e.target.value)}
                  className="startup-form_input !mt-0 flex-1"
                />
                {growthData.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    size="icon"
                    onClick={() => removeGrowthDataPoint(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" className="text-xs mt-2 bg-white" onClick={addGrowthDataPoint}>
              <Plus className="size-3 mr-1" /> Add Year
            </Button>
            {errors.growthData && <p className="startup-form_error">{errors.growthData}</p>}
          </div>

          <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100">
            <label className="startup-form_label block mb-3 text-zinc-800">Funding Sources</label>
            {fundingSources.map((source, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 mb-3">
                <Input
                  type="text"
                  placeholder="Source (e.g., Sequoia, Angel)"
                  value={source.source}
                  onChange={(e) => updateFundingSource(index, "source", e.target.value)}
                  className="startup-form_input !mt-0 flex-[2]"
                />
                <Input
                  type="number"
                  placeholder="Amount (INR)"
                  value={source.amount}
                  onChange={(e) => updateFundingSource(index, "amount", e.target.value)}
                  className="startup-form_input !mt-0 flex-1"
                />
                {fundingSources.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    size="icon"
                    onClick={() => removeFundingSource(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" className="text-xs mt-2 bg-white" onClick={addFundingSource}>
              <Plus className="size-3 mr-1" /> Add Source
            </Button>
            {errors.fundingSources && <p className="startup-form_error">{errors.fundingSources}</p>}
          </div>

          <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100">
            <label className="startup-form_label block mb-3 text-zinc-800">Revenue by Product/Service</label>
            {revenueByProduct.map((data, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 mb-3">
                <Input
                  type="text"
                  placeholder="Product Name"
                  value={data.productName}
                  onChange={(e) => updateRevenueByProduct(index, "productName", e.target.value)}
                  className="startup-form_input !mt-0 flex-[2]"
                />
                <Input
                  type="number"
                  placeholder="Revenue (INR)"
                  value={data.revenue}
                  onChange={(e) => updateRevenueByProduct(index, "revenue", e.target.value)}
                  className="startup-form_input !mt-0 flex-1"
                />
                {revenueByProduct.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    size="icon"
                    onClick={() => removeRevenueByProduct(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" className="text-xs mt-2 bg-white" onClick={addRevenueByProduct}>
              <Plus className="size-3 mr-1" /> Add Product
            </Button>
            {errors.revenueByProduct && <p className="startup-form_error">{errors.revenueByProduct}</p>}
          </div>

        </div>
      </div>

      {/* Section 3: The Pitch Deck */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-zinc-900 mb-6 border-b border-zinc-100 pb-4">3. The Pitch Deck</h2>
        <div data-color-mode="light">
          <MDEditor
            value={pitch}
            onChange={(value) => setPitch(value as string)}
            id="pitch"
            preview="edit"
            height={400}
            style={{ borderRadius: 12, overflow: "hidden", border: '1px solid #e4e4e7', boxShadow: 'none' }}
            textareaProps={{ placeholder: "Write your full pitch here. Use markdown to format your text, add lists, and include links." }}
            previewOptions={{ disallowedElements: ["style"] }}
          />
          {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-primary hover:bg-primary-700 text-white font-medium px-8 py-6 rounded-full shadow-sm text-lg" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit Pitch for Review"}
          {!isPending && <Send className="size-5 ml-2" />}
        </Button>
      </div>
      
    </form>
  );
};

export default StartupForm;