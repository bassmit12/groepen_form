// OwnerSection.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OwnerFormData = {
  owner: string;
  availableInPortal: boolean;
  commissionAgreements: string;
};

export default function OwnerSection() {
  const [formData, setFormData] = useState<OwnerFormData>({
    owner: "",
    availableInPortal: false,
    commissionAgreements: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Owner section data:", formData);
    alert("Form submitted! Check console for data.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-md shadow"
    >
      <h2 className="text-2xl font-bold">Owner</h2>

      {/* Owner Field */}
      <div>
        <Label htmlFor="owner">Owner</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="owner"
            name="owner"
            type="text"
            placeholder="Select or enter owner"
            value={formData.owner}
            onChange={handleInputChange}
          />
        </div>
        <div className="mt-2 flex gap-2">
          <Button type="button" variant="outline" size="sm">
            Select Owner
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            className="text-white"
          >
            Create New Owner
          </Button>
        </div>
      </div>

      {/* Available in Owner Portal Toggle */}
      <div className="flex items-center space-x-2">
        <Input
          id="availableInPortal"
          name="availableInPortal"
          type="checkbox"
          checked={formData.availableInPortal}
          onChange={handleInputChange}
          className="h-4 w-4"
        />
        <Label htmlFor="availableInPortal">Available in owner portal</Label>
      </div>

      {/* Commission Agreements */}
      <div>
        <Label htmlFor="commissionAgreements">Commission agreements</Label>
        <div className="flex flex-col gap-2">
          <Input
            id="commissionAgreements"
            name="commissionAgreements"
            type="text"
            placeholder="Enter commission details"
            value={formData.commissionAgreements}
            onChange={handleInputChange}
          />
          <Button
            type="button"
            variant="default"
            size="sm"
            className="self-start text-white"
          >
            Add Agreement
          </Button>
        </div>
      </div>

      {/* Knowledge Base Link */}
      <div className="text-sm">
        <Link
          href="/knowledge-base"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Go to knowledge base article
        </Link>
      </div>

      <Button type="submit" className="bg-primary text-white">
        Save
      </Button>
    </form>
  );
}
