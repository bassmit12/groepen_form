// accommodation-section.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Euro, Home, User } from "lucide-react";

interface Country {
  id: number;
  name: string;
  countryCode: string;
}

type AccommodationFormData = {
  // Basic Information
  name: string;
  group: string;
  online: "online" | "offline";
  archive: boolean;
  color: string;
  linkedAccommodations: string;

  // Address Information
  address: string;
  postalCode: string;
  city: string;
  countryId: number;
  locationCoordinates: string;

  // Online Information
  website: string;
  iCalUrl: string;

  // Capacity Information
  person: number;
  minGuests: number;
  maxGuests: number;
  personsIncluded: number;
  petsAllowed: boolean;
  maxPets: number;

  // Timing Information
  arrivalTime: string;
  differentArrivalTimes: boolean;
  departureTime: string;
  differentDepartureTimes: boolean;

  // Facilities
  parkings: number;

  // Financial
  pricePerNight: number;
  depositAmount: number;
  cleaningCost: number;
  taxPercentage: number;
  touristTax: number;
};

export default function AccommodationSection() {
  const [activeTab, setActiveTab] = useState("basic");
  const [countries, setCountries] = useState<Country[]>([]);

  const [formData, setFormData] = useState<AccommodationFormData>({
    // Basic Information
    name: "",
    group: "Nederland",
    online: "online",
    archive: false,
    color: "",
    linkedAccommodations: "",

    // Address Information
    address: "",
    postalCode: "",
    city: "",
    countryId: 136, // Default to Netherlands
    locationCoordinates: "",

    // Online Information
    website: "",
    iCalUrl: "",

    // Capacity Information
    person: 0,
    minGuests: 1,
    maxGuests: 10,
    personsIncluded: 0,
    petsAllowed: false,
    maxPets: 2,

    // Timing Information
    arrivalTime: "15:00",
    differentArrivalTimes: false,
    departureTime: "10:00",
    differentDepartureTimes: false,

    // Facilities
    parkings: 1,

    // Financial
    pricePerNight: 0,
    depositAmount: 0,
    cleaningCost: 0,
    taxPercentage: 21,
    touristTax: 0,
  });

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

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "countryId" ? parseInt(value) : value,
    }));
  };

  const handleOnlineChange = (value: "online" | "offline") => {
    setFormData((prev) => ({ ...prev, online: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Accommodation data:", formData);
    alert("Formulier ingediend! Controleer de console voor gegevens.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-md shadow"
    >
      <h2 className="text-2xl font-bold">Accommodatie</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Basisgegevens</span>
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Locatie</span>
          </TabsTrigger>
          <TabsTrigger value="capacity" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Capaciteit</span>
          </TabsTrigger>
          <TabsTrigger value="timing" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Tijden</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <Euro className="h-4 w-4" />
            <span className="hidden sm:inline">Financieel</span>
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor="name">Naam</Label>
            <Input
              id="name"
              name="name"
              placeholder="Dit is de interne naam, weergegeven binnen Bookzo"
              value={formData.name}
              onChange={handleInputChange}
              type="text"
            />
          </div>

          <div>
            <Label htmlFor="group">Groep</Label>
            <Input
              id="group"
              name="group"
              value={formData.group}
              onChange={handleInputChange}
              type="text"
            />
          </div>

          <div>
            <Label className="mb-1">Online beschikbaar</Label>
            <RadioGroup
              value={formData.online}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                placeholder="https://www.example.com"
                value={formData.website}
                onChange={handleInputChange}
                type="url"
              />
            </div>

            <div>
              <Label htmlFor="iCalUrl">iCal URL</Label>
              <Input
                id="iCalUrl"
                name="iCalUrl"
                placeholder="https://calendar.google.com/calendar/ical/..."
                value={formData.iCalUrl}
                onChange={handleInputChange}
                type="url"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="color">Kleur</Label>
              <Input
                id="color"
                name="color"
                type="text"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="linkedAccommodations">
                Gekoppelde accommodaties
              </Label>
              <Input
                id="linkedAccommodations"
                name="linkedAccommodations"
                type="text"
                value={formData.linkedAccommodations}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              id="archive"
              name="archive"
              type="checkbox"
              checked={formData.archive}
              onChange={handleInputChange}
              className="h-4 w-4"
            />
            <Label htmlFor="archive">Archiveren</Label>
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
              value={formData.address}
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
                value={formData.postalCode}
                onChange={handleInputChange}
                type="text"
              />
            </div>

            <div>
              <Label htmlFor="city">Plaats</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
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
                value={String(formData.countryId)}
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

          <div>
            <Label htmlFor="locationCoordinates">
              Locatie geografisch (Coördinaten)
            </Label>
            <Input
              id="locationCoordinates"
              name="locationCoordinates"
              placeholder="bijv. 52.3702, 4.8952"
              value={formData.locationCoordinates}
              onChange={handleInputChange}
              type="text"
            />
            <p className="text-xs text-gray-500 mt-1">
              Voer de geografische coördinaten in (breedtegraad, lengtegraad)
            </p>
          </div>
        </TabsContent>

        {/* Capacity Tab */}
        <TabsContent value="capacity" className="space-y-4">
          <div>
            <Label htmlFor="person">Persoon</Label>
            <Input
              id="person"
              name="person"
              type="number"
              value={formData.person}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="minGuests">Minimaal aantal gasten</Label>
              <Input
                id="minGuests"
                name="minGuests"
                type="number"
                value={formData.minGuests}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="maxGuests">Maximaal aantal gasten</Label>
              <Input
                id="maxGuests"
                name="maxGuests"
                type="number"
                value={formData.maxGuests}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="personsIncluded">
                Aantal personen inbegrepen in de huur
              </Label>
              <Input
                id="personsIncluded"
                name="personsIncluded"
                type="number"
                value={formData.personsIncluded}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="parkings">Aantal parkeerplaatsen</Label>
            <Input
              id="parkings"
              name="parkings"
              type="number"
              value={formData.parkings}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                id="petsAllowed"
                name="petsAllowed"
                type="checkbox"
                checked={formData.petsAllowed}
                onChange={handleInputChange}
                className="h-4 w-4"
              />
              <Label htmlFor="petsAllowed">Zijn huisdieren toegestaan?</Label>
            </div>

            {formData.petsAllowed && (
              <div>
                <Label htmlFor="maxPets">Maximum aantal huisdieren</Label>
                <Input
                  id="maxPets"
                  name="maxPets"
                  type="number"
                  min={1}
                  value={formData.maxPets}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
        </TabsContent>

        {/* Timing Tab */}
        <TabsContent value="timing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="arrivalTime">Aankomsttijd</Label>
              <Input
                id="arrivalTime"
                name="arrivalTime"
                type="time"
                value={formData.arrivalTime}
                onChange={handleInputChange}
              />

              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="differentArrivalTimes"
                  name="differentArrivalTimes"
                  type="checkbox"
                  checked={formData.differentArrivalTimes}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="differentArrivalTimes">
                  Verschillende aankomsttijden per dag
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departureTime">Vertrektijd</Label>
              <Input
                id="departureTime"
                name="departureTime"
                type="time"
                value={formData.departureTime}
                onChange={handleInputChange}
              />

              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="differentDepartureTimes"
                  name="differentDepartureTimes"
                  type="checkbox"
                  checked={formData.differentDepartureTimes}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="differentDepartureTimes">
                  Verschillende vertrektijden per dag
                </Label>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pricePerNight">Prijs per nacht</Label>
              <div className="relative">
                <Input
                  id="pricePerNight"
                  name="pricePerNight"
                  type="number"
                  min={0}
                  step="0.01"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  className="pl-8"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="depositAmount">Borg</Label>
              <div className="relative">
                <Input
                  id="depositAmount"
                  name="depositAmount"
                  type="number"
                  min={0}
                  step="0.01"
                  value={formData.depositAmount}
                  onChange={handleInputChange}
                  className="pl-8"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cleaningCost">Schoonmaakkosten</Label>
              <div className="relative">
                <Input
                  id="cleaningCost"
                  name="cleaningCost"
                  type="number"
                  min={0}
                  step="0.01"
                  value={formData.cleaningCost}
                  onChange={handleInputChange}
                  className="pl-8"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="taxPercentage">BTW percentage</Label>
              <div className="relative">
                <Input
                  id="taxPercentage"
                  name="taxPercentage"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.taxPercentage}
                  onChange={handleInputChange}
                  className="pr-8"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="touristTax">
              Toeristenbelasting (per persoon per nacht)
            </Label>
            <div className="relative">
              <Input
                id="touristTax"
                name="touristTax"
                type="number"
                min={0}
                step="0.01"
                value={formData.touristTax}
                onChange={handleInputChange}
                className="pl-8"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">€</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Separator className="my-4" />

      <div className="flex justify-end">
        <Button type="submit" className="bg-primary text-white">
          Opslaan
        </Button>
      </div>
    </form>
  );
}
