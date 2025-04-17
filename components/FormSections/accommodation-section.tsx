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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Euro,
  Home,
  User,
  Globe,
  Settings,
} from "lucide-react";

interface Country {
  id: number;
  name: string;
  countryCode: string;
}

type AccommodationFormData = {
  // Basic Information
  id?: number;
  name: string;
  code?: number;
  group: string;
  memo: string;
  online: "online" | "offline";
  onlineVisible: boolean;
  disabled: boolean;
  archive: boolean;
  color: string;
  colorPlanBoardArgb?: number;
  colorStateArgb?: number;
  linkedAccommodations: string;
  referenceCode: string;
  ledgerCode?: number;
  reservationGroupId?: number;
  accommodationGroupId?: number;
  isMaster: boolean;
  exludeFromReports?: string;
  specificatieCode: string;
  onlineBookUntil?: string;

  // Address Information
  address: string;
  postalCode: string;
  city: string;
  countryId: number;
  location: string;
  geoLocation: string;

  // Online Information
  urlWebsite: string;
  iCalCalendars: string;
  syncWithChannelManager: boolean;
  channelManagerRateCode: string;
  channelId?: string;

  // Additional API Systems
  travelbaseUsername: string;
  travelbasePassword: string;
  travelbasePriceSyncType: number | null;
  travelbaseType: number | null;
  travelbaseCode: string;
  travelbaseAddOn: number;
  travelbaseAddOnIsPercentage: boolean;

  hotekCode: string;
  hotekDoors: string;

  belvillaUsername: string;
  belvillaPassword: string;
  belvillaCode: string;
  belvillaPriceCode: string;
  belvillaAddOn: number;
  belvillaCommission: number;
  belvillabaseAddOnIsPercentage: boolean;
  belvillaPriceSyncType?: number;

  webhotelierCode: string;

  hcontrolEmail: string;
  hcontrolSecret: string;
  hcontrolPassword: string;
  hcontrolMargin?: number;
  hcontrolSendPhone: boolean;
  hcontrolSendPlate: boolean;
  hcontrolMarginArrival?: number;

  barrierCode: string;

  legionellaLocationID?: number;
  legionellaApiKey: string;
  legionellaID?: number;

  // Capacity Information
  minPersonCount: number;
  maxPersonCount: number;
  personsIncludedInRent: number;
  petsAllowed: boolean;
  numberOfPetsAllowed: number;
  surface?: number;
  surfaceOutside?: number;
  babyCountWithoutBed?: number;

  // Timing Information
  arrivalTime: string;
  departureTime: string;
  arrivalTimeMonday?: string;
  departureTimeMonday?: string;
  arrivalTimeTuesday?: string;
  departureTimeTuesday?: string;
  arrivalTimeWednesday?: string;
  departureTimeWednesday?: string;
  arrivalTimeThursday?: string;
  departureTimeThursday?: string;
  arrivalTimeFriday?: string;
  departureTimeFriday?: string;
  arrivalTimeSaturday?: string;
  departureTimeSaturday?: string;
  arrivalTimeSunday?: string;
  departureTimeSunday?: string;

  // Owner Information
  ownerId?: number;
  visibleInOwnerPortal: boolean;
  showOwnerRevenueInPortal: boolean;
  endSettlementFromPoolRevenue: boolean;

  // Financial
  prepaymentPercentage: number;
  prepaymentAmount: number;
  vatId?: number;
  percentagePrePaymentOwnerSettlement?: number;

  // Additional Fields
  freeField1?: string;
  freeField2?: string;
  freeField3?: string;
  freeField4?: string;
  freeField5?: string;
};

export default function AccommodationSection() {
  const [activeTab, setActiveTab] = useState("basic");
  const [countries, setCountries] = useState<Country[]>([]);

  const [formData, setFormData] = useState<AccommodationFormData>({
    // Basic Information
    name: "",
    code: undefined,
    group: "Nederland",
    online: "online",
    onlineVisible: true,
    disabled: false,
    archive: false,
    memo: "",
    color: "",
    colorPlanBoardArgb: undefined,
    colorStateArgb: undefined,
    linkedAccommodations: "",
    referenceCode: "",
    ledgerCode: undefined,
    reservationGroupId: undefined,
    accommodationGroupId: undefined,
    isMaster: false,
    exludeFromReports: undefined,
    specificatieCode: "",
    onlineBookUntil: undefined,

    // Address Information
    address: "",
    postalCode: "",
    city: "",
    countryId: 136, // Default to Netherlands
    location: "",
    geoLocation: "",

    // Online Information
    urlWebsite: "",
    iCalCalendars: "",
    syncWithChannelManager: false,
    channelManagerRateCode: "",
    channelId: undefined,

    // Additional API Systems
    travelbaseUsername: "",
    travelbasePassword: "",
    travelbasePriceSyncType: null,
    travelbaseType: null,
    travelbaseCode: "",
    travelbaseAddOn: 0,
    travelbaseAddOnIsPercentage: false,

    hotekCode: "",
    hotekDoors: "",

    belvillaUsername: "",
    belvillaPassword: "",
    belvillaCode: "",
    belvillaPriceCode: "",
    belvillaAddOn: 0,
    belvillaCommission: 0,
    belvillabaseAddOnIsPercentage: false,
    belvillaPriceSyncType: undefined,

    webhotelierCode: "",

    hcontrolEmail: "",
    hcontrolSecret: "",
    hcontrolPassword: "",
    hcontrolMargin: undefined,
    hcontrolSendPhone: false,
    hcontrolSendPlate: false,
    hcontrolMarginArrival: undefined,

    barrierCode: "",

    legionellaLocationID: undefined,
    legionellaApiKey: "",
    legionellaID: undefined,

    // Capacity Information
    minPersonCount: 1,
    maxPersonCount: 10,
    personsIncludedInRent: 0,
    petsAllowed: false,
    numberOfPetsAllowed: 2,
    surface: undefined,
    surfaceOutside: undefined,
    babyCountWithoutBed: undefined,

    // Timing Information
    arrivalTime: "15:00",
    departureTime: "10:00",
    arrivalTimeMonday: undefined,
    departureTimeMonday: undefined,
    arrivalTimeTuesday: undefined,
    departureTimeTuesday: undefined,
    arrivalTimeWednesday: undefined,
    departureTimeWednesday: undefined,
    arrivalTimeThursday: undefined,
    departureTimeThursday: undefined,
    arrivalTimeFriday: undefined,
    departureTimeFriday: undefined,
    arrivalTimeSaturday: undefined,
    departureTimeSaturday: undefined,
    arrivalTimeSunday: undefined,
    departureTimeSunday: undefined,

    // Owner Information
    ownerId: undefined,
    visibleInOwnerPortal: false,
    showOwnerRevenueInPortal: false,
    endSettlementFromPoolRevenue: false,

    // Financial
    prepaymentPercentage: 0,
    prepaymentAmount: 0,
    vatId: undefined,
    percentagePrePaymentOwnerSettlement: undefined,

    // Additional Fields
    freeField1: undefined,
    freeField2: undefined,
    freeField3: undefined,
    freeField4: undefined,
    freeField5: undefined,
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
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Basis</span>
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
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Integraties</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Geavanceerd</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                name="code"
                type="number"
                value={formData.code || ""}
                onChange={handleInputChange}
              />
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0">
            <div className="flex items-center space-x-2">
              <Input
                id="onlineVisible"
                name="onlineVisible"
                type="checkbox"
                checked={formData.onlineVisible}
                onChange={handleInputChange}
                className="h-4 w-4"
              />
              <Label htmlFor="onlineVisible">Online zichtbaar</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Input
                id="disabled"
                name="disabled"
                type="checkbox"
                checked={formData.disabled}
                onChange={handleInputChange}
                className="h-4 w-4"
              />
              <Label htmlFor="disabled">Uitgeschakeld</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="urlWebsite">Website</Label>
              <Input
                id="urlWebsite"
                name="urlWebsite"
                placeholder="https://www.example.com"
                value={formData.urlWebsite}
                onChange={handleInputChange}
                type="url"
              />
            </div>

            <div>
              <Label htmlFor="iCalCalendars">iCal URL</Label>
              <Input
                id="iCalCalendars"
                name="iCalCalendars"
                placeholder="https://calendar.google.com/calendar/ical/..."
                value={formData.iCalCalendars}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="referenceCode">Referentiecode</Label>
              <Input
                id="referenceCode"
                name="referenceCode"
                type="text"
                value={formData.referenceCode}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="specificatieCode">Specificatiecode</Label>
              <Input
                id="specificatieCode"
                name="specificatieCode"
                type="text"
                value={formData.specificatieCode}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Locatie (Beschrijving)</Label>
              <Input
                id="location"
                name="location"
                placeholder="Beschrijving van de locatie"
                value={formData.location}
                onChange={handleInputChange}
                type="text"
              />
            </div>

            <div>
              <Label htmlFor="geoLocation">
                Locatie geografisch (Coördinaten)
              </Label>
              <Input
                id="geoLocation"
                name="geoLocation"
                placeholder="bijv. 52.3702, 4.8952"
                value={formData.geoLocation}
                onChange={handleInputChange}
                type="text"
              />
              <p className="text-xs text-gray-500 mt-1">
                Voer de geografische coördinaten in (breedtegraad, lengtegraad)
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Capacity Tab */}
        <TabsContent value="capacity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minPersonCount">Minimaal aantal personen</Label>
              <Input
                id="minPersonCount"
                name="minPersonCount"
                type="number"
                value={formData.minPersonCount}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="maxPersonCount">Maximaal aantal personen</Label>
              <Input
                id="maxPersonCount"
                name="maxPersonCount"
                type="number"
                value={formData.maxPersonCount}
                onChange={handleInputChange}
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
              value={formData.personsIncludedInRent}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="surface">Oppervlakte binnen (m²)</Label>
              <Input
                id="surface"
                name="surface"
                type="number"
                value={formData.surface || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="surfaceOutside">Oppervlakte buiten (m²)</Label>
              <Input
                id="surfaceOutside"
                name="surfaceOutside"
                type="number"
                value={formData.surfaceOutside || ""}
                onChange={handleInputChange}
              />
            </div>
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
                <Label htmlFor="numberOfPetsAllowed">
                  Maximum aantal huisdieren
                </Label>
                <Input
                  id="numberOfPetsAllowed"
                  name="numberOfPetsAllowed"
                  type="number"
                  min={1}
                  value={formData.numberOfPetsAllowed}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="babyCountWithoutBed">Baby&apos;s zonder bed</Label>
            <Input
              id="babyCountWithoutBed"
              name="babyCountWithoutBed"
              type="number"
              value={formData.babyCountWithoutBed || ""}
              onChange={handleInputChange}
            />
          </div>
        </TabsContent>

        {/* Timing Tab */}
        <TabsContent value="timing" className="space-y-6">
          <div>
            <h3 className="text-md font-medium mb-2">Standaard tijden</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Standaard aankomsttijd</Label>
                <Input
                  id="arrivalTime"
                  name="arrivalTime"
                  type="time"
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departureTime">Standaard vertrektijd</Label>
                <Input
                  id="departureTime"
                  name="departureTime"
                  type="time"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-md font-medium mb-2">
              Specifieke tijden per dag
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Gebruik deze velden om specifieke aankomst- en vertrektijden per
              dag van de week in te stellen. Laat leeg om de standaard tijden te
              gebruiken.
            </p>

            <div className="space-y-4">
              {/* Monday */}
              <div className="border p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Maandag</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arrivalTimeMonday">
                      Aankomsttijd maandag
                    </Label>
                    <Input
                      id="arrivalTimeMonday"
                      name="arrivalTimeMonday"
                      type="time"
                      value={formData.arrivalTimeMonday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="departureTimeMonday">
                      Vertrektijd maandag
                    </Label>
                    <Input
                      id="departureTimeMonday"
                      name="departureTimeMonday"
                      type="time"
                      value={formData.departureTimeMonday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Tuesday */}
              <div className="border p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Dinsdag</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arrivalTimeTuesday">
                      Aankomsttijd dinsdag
                    </Label>
                    <Input
                      id="arrivalTimeTuesday"
                      name="arrivalTimeTuesday"
                      type="time"
                      value={formData.arrivalTimeTuesday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="departureTimeTuesday">
                      Vertrektijd dinsdag
                    </Label>
                    <Input
                      id="departureTimeTuesday"
                      name="departureTimeTuesday"
                      type="time"
                      value={formData.departureTimeTuesday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Wednesday */}
              <div className="border p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Woensdag</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arrivalTimeWednesday">
                      Aankomsttijd woensdag
                    </Label>
                    <Input
                      id="arrivalTimeWednesday"
                      name="arrivalTimeWednesday"
                      type="time"
                      value={formData.arrivalTimeWednesday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="departureTimeWednesday">
                      Vertrektijd woensdag
                    </Label>
                    <Input
                      id="departureTimeWednesday"
                      name="departureTimeWednesday"
                      type="time"
                      value={formData.departureTimeWednesday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Thursday */}
              <div className="border p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Donderdag</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arrivalTimeThursday">
                      Aankomsttijd donderdag
                    </Label>
                    <Input
                      id="arrivalTimeThursday"
                      name="arrivalTimeThursday"
                      type="time"
                      value={formData.arrivalTimeThursday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="departureTimeThursday">
                      Vertrektijd donderdag
                    </Label>
                    <Input
                      id="departureTimeThursday"
                      name="departureTimeThursday"
                      type="time"
                      value={formData.departureTimeThursday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Friday */}
              <div className="border p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Vrijdag</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arrivalTimeFriday">
                      Aankomsttijd vrijdag
                    </Label>
                    <Input
                      id="arrivalTimeFriday"
                      name="arrivalTimeFriday"
                      type="time"
                      value={formData.arrivalTimeFriday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="departureTimeFriday">
                      Vertrektijd vrijdag
                    </Label>
                    <Input
                      id="departureTimeFriday"
                      name="departureTimeFriday"
                      type="time"
                      value={formData.departureTimeFriday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Saturday */}
              <div className="border p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Zaterdag</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arrivalTimeSaturday">
                      Aankomsttijd zaterdag
                    </Label>
                    <Input
                      id="arrivalTimeSaturday"
                      name="arrivalTimeSaturday"
                      type="time"
                      value={formData.arrivalTimeSaturday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="departureTimeSaturday">
                      Vertrektijd zaterdag
                    </Label>
                    <Input
                      id="departureTimeSaturday"
                      name="departureTimeSaturday"
                      type="time"
                      value={formData.departureTimeSaturday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Sunday */}
              <div className="border p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Zondag</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arrivalTimeSunday">
                      Aankomsttijd zondag
                    </Label>
                    <Input
                      id="arrivalTimeSunday"
                      name="arrivalTimeSunday"
                      type="time"
                      value={formData.arrivalTimeSunday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="departureTimeSunday">
                      Vertrektijd zondag
                    </Label>
                    <Input
                      id="departureTimeSunday"
                      name="departureTimeSunday"
                      type="time"
                      value={formData.departureTimeSunday || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div>
            <h3 className="text-md font-medium mb-2">Betalingsgegevens</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prepaymentPercentage">
                  Aanbetalingspercentage (%)
                </Label>
                <Input
                  id="prepaymentPercentage"
                  name="prepaymentPercentage"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.prepaymentPercentage}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="prepaymentAmount">Aanbetalingsbedrag (€)</Label>
                <Input
                  id="prepaymentAmount"
                  name="prepaymentAmount"
                  type="number"
                  min={0}
                  value={formData.prepaymentAmount}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vatId">BTW-ID</Label>
              <Input
                id="vatId"
                name="vatId"
                type="number"
                value={formData.vatId || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="percentagePrePaymentOwnerSettlement">
                Percentage vooruitbetaling eigenaar afrekening
              </Label>
              <Input
                id="percentagePrePaymentOwnerSettlement"
                name="percentagePrePaymentOwnerSettlement"
                type="number"
                min={0}
                max={100}
                value={formData.percentagePrePaymentOwnerSettlement || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium mb-2">
              Eigenaar portaal instellingen
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center space-x-2">
                <Input
                  id="visibleInOwnerPortal"
                  name="visibleInOwnerPortal"
                  type="checkbox"
                  checked={formData.visibleInOwnerPortal}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="visibleInOwnerPortal">
                  Zichtbaar in eigenaar portaal
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  id="showOwnerRevenueInPortal"
                  name="showOwnerRevenueInPortal"
                  type="checkbox"
                  checked={formData.showOwnerRevenueInPortal}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="showOwnerRevenueInPortal">
                  Toon eigenaar inkomsten in portaal
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  id="endSettlementFromPoolRevenue"
                  name="endSettlementFromPoolRevenue"
                  type="checkbox"
                  checked={formData.endSettlementFromPoolRevenue}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="endSettlementFromPoolRevenue">
                  Eindafrekening uit pool inkomsten
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="ledgerCode">Grootboekcode</Label>
            <Input
              id="ledgerCode"
              name="ledgerCode"
              type="number"
              value={formData.ledgerCode || ""}
              onChange={handleInputChange}
            />
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <div>
            <h3 className="text-md font-medium mb-4">Channel Manager</h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  id="syncWithChannelManager"
                  name="syncWithChannelManager"
                  type="checkbox"
                  checked={formData.syncWithChannelManager}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="syncWithChannelManager">
                  Synchroniseren met Channel Manager
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="channelManagerRateCode">
                    Channel Manager Rate Code
                  </Label>
                  <Input
                    id="channelManagerRateCode"
                    name="channelManagerRateCode"
                    type="text"
                    value={formData.channelManagerRateCode}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="channelId">Channel ID</Label>
                  <Input
                    id="channelId"
                    name="channelId"
                    type="text"
                    value={formData.channelId || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-md font-medium mb-4">Travelbase</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="travelbaseUsername">
                  Travelbase gebruikersnaam
                </Label>
                <Input
                  id="travelbaseUsername"
                  name="travelbaseUsername"
                  type="text"
                  value={formData.travelbaseUsername}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="travelbasePassword">
                  Travelbase wachtwoord
                </Label>
                <Input
                  id="travelbasePassword"
                  name="travelbasePassword"
                  type="password"
                  value={formData.travelbasePassword}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="travelbaseCode">Travelbase code</Label>
                <Input
                  id="travelbaseCode"
                  name="travelbaseCode"
                  type="text"
                  value={formData.travelbaseCode}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="travelbaseAddOn">Travelbase toeslag</Label>
                <Input
                  id="travelbaseAddOn"
                  name="travelbaseAddOn"
                  type="number"
                  step="0.01"
                  value={formData.travelbaseAddOn}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-2 flex items-center space-x-2">
              <Input
                id="travelbaseAddOnIsPercentage"
                name="travelbaseAddOnIsPercentage"
                type="checkbox"
                checked={formData.travelbaseAddOnIsPercentage}
                onChange={handleInputChange}
                className="h-4 w-4"
              />
              <Label htmlFor="travelbaseAddOnIsPercentage">
                Travelbase toeslag is percentage
              </Label>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-md font-medium mb-4">Belvilla</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="belvillaUsername">
                  Belvilla gebruikersnaam
                </Label>
                <Input
                  id="belvillaUsername"
                  name="belvillaUsername"
                  type="text"
                  value={formData.belvillaUsername}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="belvillaPassword">Belvilla wachtwoord</Label>
                <Input
                  id="belvillaPassword"
                  name="belvillaPassword"
                  type="password"
                  value={formData.belvillaPassword}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="belvillaCode">Belvilla code</Label>
                <Input
                  id="belvillaCode"
                  name="belvillaCode"
                  type="text"
                  value={formData.belvillaCode}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="belvillaPriceCode">Belvilla prijs code</Label>
                <Input
                  id="belvillaPriceCode"
                  name="belvillaPriceCode"
                  type="text"
                  value={formData.belvillaPriceCode}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="belvillaAddOn">Belvilla toeslag</Label>
                <Input
                  id="belvillaAddOn"
                  name="belvillaAddOn"
                  type="number"
                  step="0.01"
                  value={formData.belvillaAddOn}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="belvillaCommission">Belvilla commissie</Label>
                <Input
                  id="belvillaCommission"
                  name="belvillaCommission"
                  type="number"
                  step="0.01"
                  value={formData.belvillaCommission}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-2 flex items-center space-x-2">
              <Input
                id="belvillabaseAddOnIsPercentage"
                name="belvillabaseAddOnIsPercentage"
                type="checkbox"
                checked={formData.belvillabaseAddOnIsPercentage}
                onChange={handleInputChange}
                className="h-4 w-4"
              />
              <Label htmlFor="belvillabaseAddOnIsPercentage">
                Belvilla toeslag is percentage
              </Label>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-md font-medium mb-4">Hotek</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hotekCode">Hotek code</Label>
                <Input
                  id="hotekCode"
                  name="hotekCode"
                  type="text"
                  value={formData.hotekCode}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="hotekDoors">Hotek deuren</Label>
                <Input
                  id="hotekDoors"
                  name="hotekDoors"
                  type="text"
                  value={formData.hotekDoors}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-md font-medium mb-4">H-Control</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hcontrolEmail">H-Control email</Label>
                <Input
                  id="hcontrolEmail"
                  name="hcontrolEmail"
                  type="email"
                  value={formData.hcontrolEmail}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="hcontrolPassword">H-Control wachtwoord</Label>
                <Input
                  id="hcontrolPassword"
                  name="hcontrolPassword"
                  type="password"
                  value={formData.hcontrolPassword}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="hcontrolSecret">H-Control secret</Label>
                <Input
                  id="hcontrolSecret"
                  name="hcontrolSecret"
                  type="text"
                  value={formData.hcontrolSecret}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="hcontrolMargin">H-Control marge</Label>
                <Input
                  id="hcontrolMargin"
                  name="hcontrolMargin"
                  type="number"
                  value={formData.hcontrolMargin || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="hcontrolMarginArrival">
                  H-Control marge aankomst
                </Label>
                <Input
                  id="hcontrolMarginArrival"
                  name="hcontrolMarginArrival"
                  type="number"
                  value={formData.hcontrolMarginArrival || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  id="hcontrolSendPhone"
                  name="hcontrolSendPhone"
                  type="checkbox"
                  checked={formData.hcontrolSendPhone}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="hcontrolSendPhone">
                  H-Control telefoon versturen
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  id="hcontrolSendPlate"
                  name="hcontrolSendPlate"
                  type="checkbox"
                  checked={formData.hcontrolSendPlate}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="hcontrolSendPlate">
                  H-Control nummerplaat versturen
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-md font-medium mb-4">Andere integraties</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="webhotelierCode">Webhotelier code</Label>
                <Input
                  id="webhotelierCode"
                  name="webhotelierCode"
                  type="text"
                  value={formData.webhotelierCode}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="barrierCode">Barrière code</Label>
                <Input
                  id="barrierCode"
                  name="barrierCode"
                  type="text"
                  value={formData.barrierCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-md font-medium mb-4">Legionella</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="legionellaLocationID">
                  Legionella locatie ID
                </Label>
                <Input
                  id="legionellaLocationID"
                  name="legionellaLocationID"
                  type="number"
                  value={formData.legionellaLocationID || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="legionellaID">Legionella ID</Label>
                <Input
                  id="legionellaID"
                  name="legionellaID"
                  type="number"
                  value={formData.legionellaID || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="legionellaApiKey">Legionella API sleutel</Label>
                <Input
                  id="legionellaApiKey"
                  name="legionellaApiKey"
                  type="text"
                  value={formData.legionellaApiKey}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reservationGroupId">Reserveringsgroep ID</Label>
              <Input
                id="reservationGroupId"
                name="reservationGroupId"
                type="number"
                value={formData.reservationGroupId || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="accommodationGroupId">Accommodatiegroep ID</Label>
              <Input
                id="accommodationGroupId"
                name="accommodationGroupId"
                type="number"
                value={formData.accommodationGroupId || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              id="isMaster"
              name="isMaster"
              type="checkbox"
              checked={formData.isMaster}
              onChange={handleInputChange}
              className="h-4 w-4"
            />
            <Label htmlFor="isMaster">Is hoofdaccommodatie</Label>
          </div>

          <div>
            <Label htmlFor="memo">Memo/Opmerkingen</Label>
            <Textarea
              id="memo"
              name="memo"
              placeholder="Interne opmerkingen over deze accommodatie"
              value={formData.memo}
              onChange={handleInputChange}
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="onlineBookUntil">Online boekbaar tot</Label>
            <Input
              id="onlineBookUntil"
              name="onlineBookUntil"
              type="datetime-local"
              value={formData.onlineBookUntil || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <h3 className="text-md font-medium mb-2">Vrije velden</h3>
            <p className="text-sm text-gray-500 mb-2">
              Deze velden kunnen worden gebruikt voor aangepaste informatie die
              niet past in de standaard velden.
            </p>

            <div className="space-y-2">
              <div>
                <Label htmlFor="freeField1">Vrij veld 1</Label>
                <Input
                  id="freeField1"
                  name="freeField1"
                  type="text"
                  value={formData.freeField1 || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="freeField2">Vrij veld 2</Label>
                <Input
                  id="freeField2"
                  name="freeField2"
                  type="text"
                  value={formData.freeField2 || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="freeField3">Vrij veld 3</Label>
                <Input
                  id="freeField3"
                  name="freeField3"
                  type="text"
                  value={formData.freeField3 || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="freeField4">Vrij veld 4</Label>
                <Input
                  id="freeField4"
                  name="freeField4"
                  type="text"
                  value={formData.freeField4 || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="freeField5">Vrij veld 5</Label>
                <Input
                  id="freeField5"
                  name="freeField5"
                  type="text"
                  value={formData.freeField5 || ""}
                  onChange={handleInputChange}
                />
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
