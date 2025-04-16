// GeneralSettingsSection.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type GeneralSettingsFormData = {
  name: string;
  group: string;
  online: "online" | "offline";
  person: number;
  minGuests: number;
  maxGuests: number;
  personsIncluded: number;
  petsAllowed: boolean;
  arrivalTime: string;
  differentArrivalTimes: boolean;
  departureTime: string;
  differentDepartureTimes: boolean;
  parkings: number;
  color: string;
  linkedAccommodations: string;
  archive: boolean;
};

export default function GeneralSettingsSection() {
  const [formData, setFormData] = useState<GeneralSettingsFormData>({
    name: "",
    group: "Nederland",
    online: "online",
    person: 0,
    minGuests: 1,
    maxGuests: 10,
    personsIncluded: 0,
    petsAllowed: false,
    arrivalTime: "15:00",
    differentArrivalTimes: false,
    departureTime: "10:00",
    differentDepartureTimes: false,
    parkings: 1,
    color: "",
    linkedAccommodations: "",
    archive: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOnlineChange = (value: "online" | "offline") => {
    setFormData((prev) => ({ ...prev, online: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("General Settings data:", formData);
    alert("Formulier ingediend! Controleer de console voor gegevens.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-md shadow"
    >
      <h2 className="text-2xl font-bold">Algemene instellingen</h2>

      {/* Name */}
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

      {/* Group */}
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

      {/* Online / Offline */}
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

      {/* Person */}
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

      {/* Minimum number of guests */}
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

      {/* Maximum number of guests */}
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

      {/* Number of persons included in rent */}
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

      {/* Are pets allowed */}
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

      {/* Arrival time */}
      <div>
        <Label htmlFor="arrivalTime">Aankomsttijd</Label>
        <Input
          id="arrivalTime"
          name="arrivalTime"
          type="time"
          value={formData.arrivalTime}
          onChange={handleInputChange}
        />
      </div>

      {/* Different arrival times per day */}
      <div className="flex items-center space-x-2">
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

      {/* Departure time */}
      <div>
        <Label htmlFor="departureTime">Vertrektijd</Label>
        <Input
          id="departureTime"
          name="departureTime"
          type="time"
          value={formData.departureTime}
          onChange={handleInputChange}
        />
      </div>

      {/* Different departure times per day */}
      <div className="flex items-center space-x-2">
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

      {/* Number of parkings */}
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

      {/* Color */}
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

      {/* Linked accommodations */}
      <div>
        <Label htmlFor="linkedAccommodations">Gekoppelde accommodaties</Label>
        <Input
          id="linkedAccommodations"
          name="linkedAccommodations"
          type="text"
          value={formData.linkedAccommodations}
          onChange={handleInputChange}
        />
      </div>

      {/* Archive */}
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

      <Button type="submit" className="bg-primary text-white">
        Opslaan
      </Button>
    </form>
  );
}
