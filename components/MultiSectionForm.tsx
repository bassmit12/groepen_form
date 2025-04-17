"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AccommodationSection from "./FormSections/accommodation-section";
import OwnerSection from "./FormSections/owner-section";
import FeaturesSection from "./FormSections/features-section";
import RoomsSection from "./FormSections/rooms-section";

// Updated type with separate handling for checkbox values
type FormDataType = {
  ownerName?: string;
  ownerAddress?: string;
  pricePerNight?: number;
  // Use a more specific index signature that doesn't include boolean
  [key: string]: string | number | undefined | string[];
};

// Define a type for form field objects
type FormField = {
  name: string;
  label: string;
  type: string;
};

type SectionType = {
  title: string;
  component?: React.ReactNode;
  fields?: FormField[];
};

const sections: SectionType[] = [
  {
    title: "Eigenaar",
    component: <OwnerSection />,
  },
  {
    title: "Accommodatie",
    component: <AccommodationSection />,
  },
  {
    title: "Kenmerken",
    component: <FeaturesSection />,
  },
  {
    title: "Kamers",
    component: <RoomsSection />,
  },
];

export default function MultiSectionForm() {
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({
    ownerName: "",
    ownerAddress: "",
    pricePerNight: 0,
  });

  // Keep track of checkbox states separately
  const [checkboxValues, setCheckboxValues] = useState<Record<string, boolean>>(
    {}
  );

  // Handle input changes with proper type checking
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle checkbox inputs specially
    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      // Update checkbox values separately
      const isChecked = e.target.checked;
      setCheckboxValues((prev) => ({
        ...prev,
        [name]: isChecked,
      }));
    } else {
      // For all other inputs, just use the value
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
              type="button" // Add type to prevent form submission
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
              {sections[activeSection].fields?.map((field) => (
                <div key={field.name}>
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <div className="mt-1">
                    {field.type === "checkbox" ? (
                      <div className="flex items-center gap-2">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="checkbox"
                          checked={!!checkboxValues[field.name]}
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
                        // Convert to string/number appropriately for the input value
                        value={
                          field.type === "number"
                            ? Number(formData[field.name] || 0)
                            : String(formData[field.name] || "")
                        }
                        onChange={handleInputChange}
                        className="max-w-md"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Button type="button" className="bg-primary text-white">
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
