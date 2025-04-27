// OwnerSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";

// Define interfaces for data models
interface Language {
  id: number;
  name: string;
  code: string;
}

interface Country {
  id: number;
  name: string;
  countryCode: string;
}

interface OwnerData {
  id?: number;
  name: string;
  address: string;
  contactDetails: string;
  email: string;
  phone: string;
  companyName?: string;
  countryId?: number;
  languageId?: number;
}

interface OwnerSectionProps {
  ownerData: OwnerData;
  onChange: (data: OwnerData) => void;
  hideSubmitButton?: boolean;
}

export default function OwnerSection({
  ownerData,
  onChange,
  hideSubmitButton = false,
}: OwnerSectionProps) {
  // State for form
  const [countries, setCountries] = useState<Country[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch countries and languages when component mounts
  useEffect(() => {
    fetchCountries();
    fetchLanguages();
  }, []);

  // Fetch countries from API
  const fetchCountries = async () => {
    try {
      const response = await fetch("/api/countries");
      if (response.ok) {
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          setCountries(data.results);
        }
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  // Fetch languages from API
  const fetchLanguages = async () => {
    try {
      const response = await fetch("/api/languages");
      if (response.ok) {
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          setLanguages(data.results);
        }
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedData = {
      ...ownerData,
      [name]: value,
    };
    onChange(updatedData);
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    const updatedData = {
      ...ownerData,
      [name]: parseInt(value),
    };
    onChange(updatedData);
  };

  // Create a new owner (standalone mode)
  const handleCreateOwner = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/owners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ownerData),
      });

      if (response.ok) {
        const newOwner = await response.json();
        console.log("New owner created:", newOwner);
        alert("Eigenaar succesvol aangemaakt!");
      } else {
        console.error("Error creating owner:", await response.text());
        alert("Fout bij het aanmaken van eigenaar. Zie console voor details.");
      }
    } catch (error) {
      console.error("Error creating owner:", error);
      alert("Er is een fout opgetreden. Zie console voor details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateOwner();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-md shadow"
    >
      <h2 className="text-2xl font-bold">Eigenaar</h2>

      {/* Owner Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Naam *</Label>
            <Input
              id="name"
              name="name"
              value={ownerData.name}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="companyName">Bedrijfsnaam</Label>
            <Input
              id="companyName"
              name="companyName"
              value={ownerData.companyName || ""}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={ownerData.email}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefoon</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={ownerData.phone}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Adres</Label>
            <Textarea
              id="address"
              name="address"
              value={ownerData.address}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="contactDetails">Contactgegevens</Label>
            <Textarea
              id="contactDetails"
              name="contactDetails"
              value={ownerData.contactDetails}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="countryId">Land</Label>
            <Select
              onValueChange={(value) => handleSelectChange("countryId", value)}
              value={String(ownerData.countryId || 136)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecteer land" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={String(country.id)}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="languageId">Taal</Label>
            <Select
              onValueChange={(value) => handleSelectChange("languageId", value)}
              value={String(ownerData.languageId || 1)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecteer taal" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.id} value={String(language.id)}>
                    {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {!hideSubmitButton && (
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Aanmaken...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Eigenaar aanmaken
            </>
          )}
        </Button>
      )}
    </form>
  );
}
