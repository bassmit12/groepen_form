"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GeneralSettingsSection from "./FormSections/general-settings-section";
import OwnerSection from "./FormSections/owner-section";

type FormDataType = {
  ownerName?: string;
  ownerAddress?: string;
  pricePerNight?: number;
};

const sections = [
  {
    title: "General settings",
    component: <GeneralSettingsSection />,
  },
  {
    title: "Owner",
    component: <OwnerSection />,
  },
  {
    title: "Financial",
    fields: [
      { name: "pricePerNight", label: "Price per night", type: "number" },
    ],
  },
];

export default function MultiSectionForm() {
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({
    ownerName: "",
    ownerAddress: "",
    pricePerNight: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="flex w-full h-full bg-white border border-gray-200 rounded-md">
      {/* LEFT SIDEBAR */}
      <div className="w-64 border-r border-gray-200 p-4">
        <nav className="space-y-2">
          {sections.map((section, idx) => (
            <button
              key={section.title}
              onClick={() => setActiveSection(idx)}
              className={`block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                activeSection === idx ? "bg-gray-200" : ""
              }`}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* RIGHT SIDE CONTENT */}
      <div className="flex-1 space-y-6 overflow-auto">
        {sections[activeSection].component ? (
          sections[activeSection].component
        ) : (
          <div className="p-6">
            <h2 className="text-xl font-bold">
              {sections[activeSection].title}
            </h2>
            <div className="space-y-4">
              {sections[activeSection].fields.map((field: any) => (
                <div key={field.name}>
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <div className="mt-1">
                    {field.type === "checkbox" ? (
                      <div className="flex items-center gap-2">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="checkbox"
                          checked={!!formData[field.name]}
                          onChange={handleInputChange}
                          className="h-4 w-4"
                        />
                        <span>{field.label}</span>
                      </div>
                    ) : (
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name] ?? ""}
                        onChange={handleInputChange}
                        className="max-w-md"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Button type="submit" className="bg-primary text-white">
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
