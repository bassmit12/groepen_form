"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Check } from "lucide-react";

// Form configuration
const formFields = {
  owner: {
    name: "owner",
    label: "Naam eigenaar *",
  },
  country: {
    name: "country",
    label: "Land *",
  },
  language: {
    name: "language",
    label: "Taal *",
  },
};

const stages = [
  {
    name: "Eigenaar",
    fields: ["owner", "country", "language"],
  },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const PropertyListingForm = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [formData, setFormData] = useState({
    owner: "",
    country: "",
    language: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldSubmit = async (fieldName: string, value: string) => {
    try {
      console.log(
        `Testing submission for field: ${fieldName} with value: ${value}`,
      );

      if (!BACKEND_URL) {
        throw new Error("Backend URL is not defined");
      }

      const response = await fetch(`${BACKEND_URL}/api/${fieldName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          [fieldName]: value,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Test submission response:", data);
      alert(`Test submission successful! Check console for details.`);
    } catch (error) {
      console.error("Error during test submission:", error);
      alert(`Error during test submission: ${error}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!BACKEND_URL) {
        throw new Error("Backend URL is not defined");
      }

      const response = await fetch(`${BACKEND_URL}/api/owner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Form submission response:", data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error during form submission:", error);
      alert(`Error during form submission: ${error}`);
    }
  };

  const renderFormFields = () => {
    const currentFields = stages[currentStage].fields;

    return (
      <div className="space-y-6">
        {currentFields.map((fieldName) => (
          <div key={fieldName}>
            <Label htmlFor={fieldName}>{formFields[fieldName].label}</Label>
            <div className="flex gap-2">
              <Input
                id={fieldName}
                name={fieldName}
                value={formData[fieldName]}
                onChange={handleInputChange}
                required
                placeholder={`Voer ${formFields[fieldName].label.toLowerCase()} in`}
              />
              <Button
                type="button"
                onClick={() =>
                  handleFieldSubmit(fieldName, formData[fieldName])
                }
                className="bg-yellow-500 hover:bg-yellow-600 text-white whitespace-nowrap"
              >
                Test Field
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-white rounded-lg shadow-lg">
        <div className="w-24 h-24 relative">
          <Check className="w-full h-full text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mt-4">Bedankt!</h3>
        <p className="text-gray-600 text-center">
          Uw aanvraag is succesvol verzonden. We nemen zo snel mogelijk contact
          met u op.
        </p>
      </div>
    );
  }

  return (
    <section id="property-listing-form" className="relative py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Meld uw accommodatie aan
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Vul de onderstaande gegevens in om uw groepsaccommodatie aan te
              melden voor verhuur via Groepen.nl.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white p-8 rounded-lg shadow-lg border border-gray-200"
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-primary mb-4">
                {stages[currentStage].name}
              </h3>
              {renderFormFields()}
            </div>

            <div className="flex justify-end mt-8">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 py-2 px-4"
              >
                Verstuur aanvraag
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PropertyListingForm;
