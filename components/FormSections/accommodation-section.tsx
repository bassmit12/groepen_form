// accommodation-section.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, MapPin, User, Calendar } from "lucide-react";

interface Country {
  id: number;
  name: string;
  countryCode: string;
}

type AccommodationData = {
  id?: number;
  name: string;
  code?: number;
  online: "online" | "offline";
  onlineVisible: boolean;
  disabled: boolean;
  memo: string;
  address: string;
  postalCode: string;
  city: string;
  countryId: number;
  minPersonCount: number;
  maxPersonCount: number;
  personsIncludedInRent: number;
  petsAllowed: boolean;
  numberOfPetsAllowed: number;
  surface?: number;
  arrivalTime: string;
  departureTime: string;
  ownerId?: number;
};

interface AccommodationSectionProps {
  accommodationData: AccommodationData;
  onChange: (data: AccommodationData) => void;
  hideSubmitButton?: boolean;
}

export default function AccommodationSection({
  accommodationData,
  onChange,
  hideSubmitButton = false,
}: AccommodationSectionProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [countries, setCountries] = useState<Country[]>([]);

  // Fetch countries when component mounts
  useEffect(() => {
    fetchCountries();
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    const updatedData = {
      ...accommodationData,
      [name]:
        type === "checkbox"
          ? checked
          : name.includes("Count") || name === "surface"
          ? value === ""
            ? undefined
            : parseInt(value) || 0
          : value,
    };

    onChange(updatedData);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    const updatedData = {
      ...accommodationData,
      [name]: checked,
    };

    onChange(updatedData);
  };

  const handleSelectChange = (name: string, value: string) => {
    const updatedData = {
      ...accommodationData,
      [name]: name === "countryId" ? parseInt(value) : value,
    };

    onChange(updatedData);
  };

  const handleOnlineChange = (value: "online" | "offline") => {
    const updatedData = {
      ...accommodationData,
      online: value,
    };

    onChange(updatedData);
  };

  // Standalone submission (when not using the unified save approach)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Client-side validation
      if (!accommodationData.name) {
        alert("Naam is verplicht");
        return;
      }

      // Submit data
      // Make sure to explicitly set the uppercase Name field that the API requires
      const submissionData = {
        ...accommodationData,
        Name: accommodationData.name, // API explicitly requires uppercase Name field
      };

      console.log("Submitting accommodation data:", submissionData);

      // Make API request
      const response = await fetch("/api/accommodations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Submission successful:", result);
        alert("Accommodatie succesvol opgeslagen!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Submission failed:", response.status, errorData);
        alert(
          `Fout bij opslaan: ${response.status} ${errorData.message || ""} ${
            errorData.details || ""
          }`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "Er is een fout opgetreden bij het opslaan. Controleer de console voor details."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-md shadow"
    >
      <div>
        <h2 className="text-2xl font-bold mb-4">Accommodatie</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Basis</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Locatie</span>
            </TabsTrigger>
            <TabsTrigger value="capacity" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Capaciteit</span>
            </TabsTrigger>
            <TabsTrigger value="timing" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Tijden</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="name">Naam *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Naam van de accommodatie"
                value={accommodationData.name}
                onChange={handleInputChange}
                type="text"
                required
              />
            </div>

            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                name="code"
                type="number"
                value={
                  accommodationData.code === undefined
                    ? ""
                    : accommodationData.code
                }
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label className="mb-1">Online beschikbaar</Label>
              <RadioGroup
                value={accommodationData.online}
                onValueChange={(val) =>
                  handleOnlineChange(val as "online" | "offline")
                }
                className="flex items-center gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online">Online</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="offline" id="offline" />
                  <Label htmlFor="offline">Offline</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="onlineVisible"
                checked={accommodationData.onlineVisible}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("onlineVisible", checked as boolean)
                }
              />
              <Label htmlFor="onlineVisible">Online zichtbaar</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="disabled"
                checked={accommodationData.disabled}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("disabled", checked as boolean)
                }
              />
              <Label htmlFor="disabled">Uitgeschakeld</Label>
            </div>

            <div>
              <Label htmlFor="memo">Memo/Opmerkingen</Label>
              <Textarea
                id="memo"
                name="memo"
                placeholder="Interne opmerkingen over deze accommodatie"
                value={accommodationData.memo}
                onChange={handleInputChange}
                className="mt-1 min-h-[100px]"
              />
            </div>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location" className="space-y-4">
            <div>
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                name="address"
                placeholder="Straatnaam en huisnummer"
                value={accommodationData.address}
                onChange={handleInputChange}
                type="text"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="postalCode">Postcode</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={accommodationData.postalCode}
                  onChange={handleInputChange}
                  type="text"
                />
              </div>

              <div>
                <Label htmlFor="city">Plaats</Label>
                <Input
                  id="city"
                  name="city"
                  value={accommodationData.city}
                  onChange={handleInputChange}
                  type="text"
                />
              </div>

              <div>
                <Label htmlFor="countryId">Land</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("countryId", value)
                  }
                  value={String(accommodationData.countryId)}
                >
                  <SelectTrigger>
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
            </div>
          </TabsContent>

          {/* Capacity Tab */}
          <TabsContent value="capacity" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPersonCount">
                  Minimaal aantal personen *
                </Label>
                <Input
                  id="minPersonCount"
                  name="minPersonCount"
                  type="number"
                  value={accommodationData.minPersonCount}
                  onChange={handleInputChange}
                  min={1}
                  required
                />
              </div>

              <div>
                <Label htmlFor="maxPersonCount">
                  Maximaal aantal personen *
                </Label>
                <Input
                  id="maxPersonCount"
                  name="maxPersonCount"
                  type="number"
                  value={accommodationData.maxPersonCount}
                  onChange={handleInputChange}
                  min={1}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="personsIncludedInRent">
                Aantal personen inbegrepen in de huur
              </Label>
              <Input
                id="personsIncludedInRent"
                name="personsIncludedInRent"
                type="number"
                value={accommodationData.personsIncludedInRent}
                onChange={handleInputChange}
                min={0}
              />
            </div>

            <div>
              <Label htmlFor="surface">Oppervlakte (m²)</Label>
              <Input
                id="surface"
                name="surface"
                type="number"
                value={
                  accommodationData.surface === undefined
                    ? ""
                    : accommodationData.surface
                }
                onChange={handleInputChange}
                min={0}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="petsAllowed"
                  checked={accommodationData.petsAllowed}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("petsAllowed", checked as boolean)
                  }
                />
                <Label htmlFor="petsAllowed">Zijn huisdieren toegestaan?</Label>
              </div>

              {accommodationData.petsAllowed && (
                <div>
                  <Label htmlFor="numberOfPetsAllowed">
                    Maximum aantal huisdieren
                  </Label>
                  <Input
                    id="numberOfPetsAllowed"
                    name="numberOfPetsAllowed"
                    type="number"
                    min={1}
                    value={accommodationData.numberOfPetsAllowed}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Timing Tab */}
          <TabsContent value="timing" className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">Standaard tijden</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">Standaard aankomsttijd</Label>
                  <Input
                    id="arrivalTime"
                    name="arrivalTime"
                    type="time"
                    value={accommodationData.arrivalTime}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departureTime">Standaard vertrektijd</Label>
                  <Input
                    id="departureTime"
                    name="departureTime"
                    type="time"
                    value={accommodationData.departureTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {!hideSubmitButton && (
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Explicitly type the reset data to match AccommodationData
              const resetData: AccommodationData = {
                name: "",
                code: undefined,
                online: "online", // This is now properly typed as "online" | "offline"
                onlineVisible: true,
                disabled: false,
                memo: "",
                address: "",
                postalCode: "",
                city: "",
                countryId: 136,
                minPersonCount: 1,
                maxPersonCount: 4,
                personsIncludedInRent: 0,
                petsAllowed: false,
                numberOfPetsAllowed: 0,
                surface: undefined,
                arrivalTime: "15:00",
                departureTime: "10:00",
              };

              onChange(resetData);
            }}
          >
            Annuleren
          </Button>
          <Button type="submit">Opslaan</Button>
        </div>
      )}
    </form>
  );
}
