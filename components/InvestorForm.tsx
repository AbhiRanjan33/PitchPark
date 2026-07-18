"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import { useSession } from "next-auth/react";

interface InvestorFormProps {
  user: {
    _id: string;
    numberOfInvestments?: number;
    bestInvestments?: string[];
    yearsOfExperience?: number;
    investmentTypes?: string[];
    investmentStage?: string[];
    ticketSize?: number;
  } | null;
}

const InvestorForm = ({ user }: InvestorFormProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  // Initialize formData with empty values if user is null
  const [formData, setFormData] = useState({
    numberOfInvestments: user?.numberOfInvestments || "",
    bestInvestments: user?.bestInvestments?.join(", ") || "",
    yearsOfExperience: user?.yearsOfExperience || "",
    investmentTypes: user?.investmentTypes?.join(", ") || "",
    investmentStage: user?.investmentStage?.join(", ") || "",
    ticketSize: user?.ticketSize || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(
    !!user?.numberOfInvestments ||
      !!user?.bestInvestments?.length ||
      !!user?.yearsOfExperience ||
      !!user?.investmentTypes?.length ||
      !!user?.investmentStage?.length ||
      !!user?.ticketSize
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use user._id if available, else session.id, else a temporary ID
      const userId = user?._id || session?.id || `temp-user-${Date.now()}`;

      const patchData = {
        _type: "user",
        numberOfInvestments: formData.numberOfInvestments
          ? parseInt(formData.numberOfInvestments as string)
          : undefined,
        bestInvestments: formData.bestInvestments
          ? formData.bestInvestments
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        yearsOfExperience: formData.yearsOfExperience
          ? parseInt(formData.yearsOfExperience as string)
          : undefined,
        investmentTypes: formData.investmentTypes
          ? formData.investmentTypes
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        investmentStage: formData.investmentStage
          ? formData.investmentStage
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        ticketSize: formData.ticketSize
          ? parseInt(formData.ticketSize as string)
          : undefined,
      };

      // If user exists, patch; otherwise, create a new document
      if (user?._id) {
        await client.patch(userId).set(patchData).commit();
      } else {
        await client.create({
          ...patchData,
          _id: userId,
          role: "investor", // Set default role for new user
        });
      }

      setSubmitted(true);
      router.refresh();
    } catch (err) {
      console.error("Error saving investor details:", err);
      setError("Failed to save investor details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="startup-form">
      <h3 className="text-30-bold mb-4">Investor Profile</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="numberOfInvestments" className="startup-form_label">
            Number of Investments
          </label>
          <input
            type="number"
            id="numberOfInvestments"
            name="numberOfInvestments"
            value={formData.numberOfInvestments}
            onChange={handleChange}
            className="startup-form_input w-full"
            placeholder="e.g., 10"
          />
        </div>

        <div>
          <label htmlFor="bestInvestments" className="startup-form_label">
            Best Investments (comma-separated)
          </label>
          <input
            type="text"
            id="bestInvestments"
            name="bestInvestments"
            value={formData.bestInvestments}
            onChange={handleChange}
            className="startup-form_input w-full"
            placeholder="e.g., Startup A, Startup B"
          />
        </div>

        <div>
          <label htmlFor="yearsOfExperience" className="startup-form_label">
            Years of Experience
          </label>
          <input
            type="number"
            id="yearsOfExperience"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            className="startup-form_input w-full"
            placeholder="e.g., 5"
          />
        </div>

        <div>
          <label htmlFor="investmentTypes" className="startup-form_label">
            Type of Investments (comma-separated)
          </label>
          <input
            type="text"
            id="investmentTypes"
            name="investmentTypes"
            value={formData.investmentTypes}
            onChange={handleChange}
            className="startup-form_input w-full"
            placeholder="e.g., Angel, Venture Capital"
          />
        </div>

        <div>
          <label htmlFor="investmentStage" className="startup-form_label">
            Investment Stage (comma-separated)
          </label>
          <input
            type="text"
            id="investmentStage"
            name="investmentStage"
            value={formData.investmentStage}
            onChange={handleChange}
            className="startup-form_input w-full"
            placeholder="e.g., Pre-Seed, Series A"
          />
        </div>

        <div>
          <label htmlFor="ticketSize" className="startup-form_label">
            Ticket Size (INR)
          </label>
          <input
            type="number"
            id="ticketSize"
            name="ticketSize"
            value={formData.ticketSize}
            onChange={handleChange}
            className="startup-form_input w-full"
            placeholder="e.g., 5000000"
          />
        </div>

        {error && <p className="startup-form_error">{error}</p>}

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className="btn-primary text-white"
          >
            {loading ? "Saving..." : "Save Investor Profile"}
          </Button>
        </div>
      </form>

      {submitted && (
        <div className="section-card p-6 mt-10">
          <h3 className="text-30-semibold mb-4">Investment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-16-medium">
            <p>
              <span className="font-semibold">Number of Investments:</span>{" "}
              {formData.numberOfInvestments || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Best Investments:</span>{" "}
              {formData.bestInvestments || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Years of Experience:</span>{" "}
              {formData.yearsOfExperience || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Type of Investments:</span>{" "}
              {formData.investmentTypes || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Investment Stage:</span>{" "}
              {formData.investmentStage || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Ticket Size:</span>{" "}
              {formData.ticketSize
                ? `₹${parseInt(formData.ticketSize as string).toLocaleString()}`
                : "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorForm;