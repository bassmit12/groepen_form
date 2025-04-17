// OwnerSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface NewOwnerData {
  contactPerson: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  streetname: string;
  housenumber: string;
  city: string;
  postalCode: string;
  countryId: number;
  languageId: number;
}

export default function OwnerSection() {
  // State for the new owner form
  const [countries, setCountries] = useState<Country[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [newOwnerData, setNewOwnerData] = useState<NewOwnerData>({
    contactPerson: "",
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    streetname: "",
    housenumber: "",
    city: "",
    postalCode: "",
    countryId: 136, // Default to Netherlands
    languageId: 1, // Default to Dutch
  });
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

  // Handle input changes for new owner form
  const handleNewOwnerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewOwnerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle new owner select changes
  const handleNewOwnerSelectChange = (name: string, value: string) => {
    setNewOwnerData((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  // Create a new owner
  const handleCreateOwner = async () => {
    try {
      setIsLoading(true);

      // Update last name if both provided
      const updatedData = {
        ...newOwnerData,
        contactPerson:
          newOwnerData.firstName && newOwnerData.lastName
            ? `${newOwnerData.firstName} ${newOwnerData.lastName}`
            : newOwnerData.contactPerson,
      };

      const response = await fetch("/api/owners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const newOwner = await response.json();
        console.log("New owner created:", newOwner);

        // Reset new owner form
        setNewOwnerData({
          contactPerson: "",
          firstName: "",
          lastName: "",
          companyName: "",
          email: "",
          phone: "",
          streetname: "",
          housenumber: "",
          city: "",
          postalCode: "",
          countryId: 136,
          languageId: 1,
        });

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

      {/* New Owner Form */}
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-4">
        <h3 className="font-medium text-lg">Nieuwe eigenaar aanmaken</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Voornaam</Label>
            <Input
              id="firstName"
              name="firstName"
              value={newOwnerData.firstName}
              onChange={handleNewOwnerInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Achternaam</Label>
            <Input
              id="lastName"
              name="lastName"
              value={newOwnerData.lastName}
              onChange={handleNewOwnerInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="companyName">Bedrijfsnaam</Label>
            <Input
              id="companyName"
              name="companyName"
              value={newOwnerData.companyName}
              onChange={handleNewOwnerInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={newOwnerData.email}
              onChange={handleNewOwnerInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefoon</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={newOwnerData.phone}
              onChange={handleNewOwnerInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="streetname">Straat</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="streetname"
                name="streetname"
                value={newOwnerData.streetname}
                onChange={handleNewOwnerInputChange}
                className="flex-grow"
              />
              <Input
                id="housenumber"
                name="housenumber"
                value={newOwnerData.housenumber}
                onChange={handleNewOwnerInputChange}
                className="w-24"
                placeholder="Nr."
              />
            </div>
          </div>
          <div>
            <Label htmlFor="postalCode">Postcode</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={newOwnerData.postalCode}
              onChange={handleNewOwnerInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="city">Plaats</Label>
            <Input
              id="city"
              name="city"
              value={newOwnerData.city}
              onChange={handleNewOwnerInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="countryId">Land</Label>
            <Select
              onValueChange={(value) =>
                handleNewOwnerSelectChange("countryId", value)
              }
              defaultValue={String(newOwnerData.countryId)}
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
              onValueChange={(value) =>
                handleNewOwnerSelectChange("languageId", value)
              }
              defaultValue={String(newOwnerData.languageId)}
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
    </form>
  );
}
