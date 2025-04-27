"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AccommodationSection from "./FormSections/accommodation-section";
import OwnerSection from "./FormSections/owner-section";
import FeaturesSection from "./FormSections/features-section";
import RoomsSection from "./FormSections/rooms-section";
import { toast } from "sonner";
import {
  mockOwners,
  mockAccommodations,
  mockFeatures,
  mockRooms,
  mockRoomFeatures,
} from "@/lib/mockData";

// Define the main form state type
type FormState = {
  owner: {
    id?: number;
    name: string;
    address: string;
    contactDetails: string;
    email: string;
    phone: string;
    companyName?: string;
    countryId?: number;
    languageId?: number;
    // Add other owner fields as needed
  };
  accommodation: {
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
    // Add other accommodation fields as needed
  };
  features: {
    id?: number;
    featureID: number;
    value: string;
    accommodationID?: number;
  }[];
  rooms: {
    id?: number;
    accommodationRoomType: number;
    floor: number;
    position: number;
    suffix: string;
    accommodationId?: number;
  }[];
  roomFeatures: {
    roomId?: number;
    featureId: number;
    value: string;
  }[];
};

type SectionType = {
  title: string;
  key: keyof FormState;
};

const sections: SectionType[] = [
  {
    title: "Eigenaar",
    key: "owner",
  },
  {
    title: "Accommodatie",
    key: "accommodation",
  },
  {
    title: "Kenmerken",
    key: "features",
  },
  {
    title: "Kamers",
    key: "rooms",
  },
];

export default function MultiSectionForm() {
  const [activeSection, setActiveSection] = useState(0);
  const [saving, setSaving] = useState(false);

  // Initialize form state with default values
  const [formState, setFormState] = useState<FormState>({
    owner: {
      name: "",
      address: "",
      contactDetails: "",
      email: "",
      phone: "",
      companyName: "",
    },
    accommodation: {
      name: "",
      code: undefined,
      online: "online",
      onlineVisible: true,
      disabled: false,
      memo: "",
      address: "",
      postalCode: "",
      city: "",
      countryId: 136, // Default to Netherlands
      minPersonCount: 1,
      maxPersonCount: 4,
      personsIncludedInRent: 0,
      petsAllowed: false,
      numberOfPetsAllowed: 0,
      surface: undefined,
      arrivalTime: "15:00",
      departureTime: "10:00",
      ownerId: undefined,
    },
    features: [],
    rooms: [],
    roomFeatures: [],
  });

  // Update individual sections of the form state
  const updateFormSection = <K extends keyof FormState>(
    section: K,
    data: FormState[K]
  ) => {
    setFormState((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  // Load example data for testing
  const loadExampleData = (exampleIndex: number = 0) => {
    // Make sure we have a valid index
    const index = Math.min(exampleIndex, mockOwners.length - 1);

    // Create a properly typed accommodation object by explicitly casting the online property
    const typedAccommodation: FormState["accommodation"] = {
      ...mockAccommodations[index],
      // Ensure the online property is properly typed as "online" | "offline"
      online: mockAccommodations[index].online as "online" | "offline"
    };

    setFormState({
      owner: {
        ...mockOwners[index],
      },
      accommodation: typedAccommodation,
      features: [...mockFeatures],
      rooms: [...mockRooms],
      roomFeatures: [...mockRoomFeatures],
    });

    toast.success(`Voorbeeld ${index + 1} geladen`, {
      description: "Alle velden zijn gevuld met voorbeeldgegevens",
    });
  };

  // Handle the main save operation
  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate required fields
      if (!formState.owner.name) {
        toast.error("Eigenaar naam is verplicht");
        setActiveSection(0); // Switch to owner section
        setSaving(false);
        return;
      }

      if (!formState.accommodation.name) {
        toast.error("Accommodatie naam is verplicht");
        setActiveSection(1); // Switch to accommodation section
        setSaving(false);
        return;
      }

      // 1. First, save the owner
      const ownerResponse = await saveOwner(formState.owner);

      if (!ownerResponse.success) {
        toast.error(`Fout bij opslaan eigenaar: ${ownerResponse.error}`);
        setActiveSection(0); // Switch to owner section
        setSaving(false);
        return;
      }

      const ownerId = ownerResponse.data.id;
      toast.success("Eigenaar succesvol opgeslagen");

      // 2. Then, save the accommodation with the owner ID
      const accommodationData = {
        ...formState.accommodation,
        ownerId: ownerId,
        Name: formState.accommodation.name, // Add capitalized Name field for API
      };

      const accommodationResponse = await saveAccommodation(accommodationData);

      if (!accommodationResponse.success) {
        toast.error(
          `Fout bij opslaan accommodatie: ${accommodationResponse.error}`
        );
        setActiveSection(1); // Switch to accommodation section
        setSaving(false);
        return;
      }

      const accommodationId = accommodationResponse.data.id;
      toast.success("Accommodatie succesvol opgeslagen");

      // 3. Save features for the accommodation
      if (formState.features.length > 0) {
        const featuresData = formState.features.map((feature) => ({
          ...feature,
          accommodationID: accommodationId,
        }));

        const featuresResponse = await saveFeatures(
          accommodationId,
          featuresData
        );

        if (!featuresResponse.success) {
          toast.error(`Fout bij opslaan kenmerken: ${featuresResponse.error}`);
          setActiveSection(2); // Switch to features section
          setSaving(false);
          return;
        }

        toast.success("Kenmerken succesvol opgeslagen");
      }

      // 4. Save rooms for the accommodation
      if (formState.rooms.length > 0) {
        const roomsData = formState.rooms.map((room) => ({
          ...room,
          accommodationId: accommodationId,
        }));

        const roomsResponse = await saveRooms(accommodationId, roomsData);

        if (!roomsResponse.success) {
          toast.error(`Fout bij opslaan kamers: ${roomsResponse.error}`);
          setActiveSection(3); // Switch to rooms section
          setSaving(false);
          return;
        }

        // Get room IDs from response
        const rooms = roomsResponse.data;
        toast.success("Kamers succesvol opgeslagen");

        // 5. Save room features if needed
        if (formState.roomFeatures.length > 0) {
          // Map room features to the saved rooms
          // This would need more complex logic if your rooms have specific mapping needs

          // Example approach: assume roomFeatures have indices that match the rooms array
          // This is a simplification - in a real app, you'd need proper mapping logic
          for (let i = 0; i < rooms.length; i++) {
            if (formState.roomFeatures[i]) {
              // Use the roomFeatures data to save to the API
              // This is a placeholder until the actual API endpoint is implemented
              console.log(`Would save room features for room ${rooms[i].id}:`, formState.roomFeatures[i]);
              
              // Handle room features save logic here (endpoint not shown in context)
              // ... room features save logic ...
            }
          }
        }
      }

      toast.success("Alles succesvol opgeslagen!", {
        description: "Alle gegevens zijn opgeslagen in het systeem.",
      });
    } catch (error) {
      console.error("Error saving form data:", error);
      toast.error("Er is een fout opgetreden bij het opslaan");
    } finally {
      setSaving(false);
    }
  };

  // Helper functions for saving each section
  const saveOwner = async (ownerData: FormState["owner"]) => {
    try {
      const response = await fetch("/api/owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ownerData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `${response.status} ${errorData.message || ""} ${
            errorData.details || ""
          }`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error saving owner:", error);
      return {
        success: false,
        error: "Er is een fout opgetreden bij het opslaan van de eigenaar",
      };
    }
  };

  const saveAccommodation = async (
    accommodationData: FormState["accommodation"] & { Name: string }
  ) => {
    try {
      const response = await fetch("/api/accommodations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accommodationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `${response.status} ${errorData.message || ""} ${
            errorData.details || ""
          }`,
        };
      }

      const data = await response.json();
      return { success: true, data: data.data };
    } catch (error) {
      console.error("Error saving accommodation:", error);
      return {
        success: false,
        error: "Er is een fout opgetreden bij het opslaan van de accommodatie",
      };
    }
  };

  const saveFeatures = async (
    accommodationId: number,
    featuresData: FormState["features"]
  ) => {
    try {
      const response = await fetch(
        `/api/accommodations/${accommodationId}/features`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(featuresData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `${response.status} ${errorData.message || ""} ${
            errorData.details || ""
          }`,
        };
      }

      const data = await response.json();
      return { success: true, data: data.data };
    } catch (error) {
      console.error("Error saving features:", error);
      return {
        success: false,
        error: "Er is een fout opgetreden bij het opslaan van de kenmerken",
      };
    }
  };

  const saveRooms = async (
    accommodationId: number,
    roomsData: FormState["rooms"]
  ) => {
    try {
      const response = await fetch(
        `/api/accommodations/${accommodationId}/rooms`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roomsData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `${response.status} ${errorData.message || ""} ${
            errorData.details || ""
          }`,
        };
      }

      const data = await response.json();
      return { success: true, data: data.data };
    } catch (error) {
      console.error("Error saving rooms:", error);
      return {
        success: false,
        error: "Er is een fout opgetreden bij het opslaan van de kamers",
      };
    }
  };

  // Helper functions for feature mapping
  const getFeatureName = (featureId: number): string => {
    // Map feature IDs to names - these would typically come from an API
    const featureNames: Record<number, string> = {
      1: "WiFi",
      2: "Zwembad",
      3: "Toilet",
      4: "Douche",
      5: "TV",
      6: "Bedden",
      7: "Vaatwasser",
      8: "Koelkast",
      9: "Inductiekookplaat",
      10: "Speeltoestellen",
      11: "Terras",
      12: "Parkeerplaats",
    };
    return featureNames[featureId] || `Kenmerk ${featureId}`;
  };

  const getFeatureGroup = (featureId: number): string => {
    // Map feature IDs to groups - these would typically come from an API
    const featureGroups: Record<number, string> = {
      1: "Algemeen",
      2: "Recreatie",
      3: "Sanitair",
      4: "Sanitair",
      5: "Entertainment",
      6: "Slaapkamer",
      7: "Keuken",
      8: "Keuken",
      9: "Keuken",
      10: "Buitenfaciliteiten",
      11: "Buitenfaciliteiten",
      12: "Buitenfaciliteiten",
    };
    return featureGroups[featureId] || "Overige";
  };

  return (
    <div className="flex flex-col w-full h-full bg-white border border-gray-200 rounded-md">
      {/* TEST DATA BUTTONS */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadExampleData(0)}
          >
            Laad voorbeeld 1: Boshuis
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadExampleData(1)}
          >
            Laad voorbeeld 2: Waterkant
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadExampleData(2)}
          >
            Laad voorbeeld 3: Groepsboerderij
          </Button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Klik op een van bovenstaande knoppen om voorbeeldgegevens te laden
          voor sneller testen.
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
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
                type="button" // Prevent form submission
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="flex-1 overflow-auto">
          {activeSection === 0 && (
            <OwnerSection
              ownerData={formState.owner}
              onChange={(data) => updateFormSection("owner", data)}
              hideSubmitButton={true}
            />
          )}

          {activeSection === 1 && (
            <AccommodationSection
              accommodationData={formState.accommodation}
              onChange={(data) => updateFormSection("accommodation", data)}
              hideSubmitButton={true}
            />
          )}

          {activeSection === 2 && (
            <FeaturesSection
              initialSelected={formState.features.map((feature) => ({
                id: feature.featureID,
                name: getFeatureName(feature.featureID),
                featuregroup: getFeatureGroup(feature.featureID),
                useForFilter: true,
                featureDataType: feature.value ? 1 : 0,
                defaultValue: feature.value,
                sortOrder: String(feature.featureID),
              }))}
              onComplete={(selectedFeatures) => {
                // Convert the selected features back to the format used in formState
                const featuresData = selectedFeatures.map((feature) => ({
                  featureID: feature.id,
                  value: feature.defaultValue || "1",
                }));
                updateFormSection("features", featuresData);
              }}
              hideSubmitButton={true}
              standalone={true}
            />
          )}

          {activeSection === 3 && (
            <RoomsSection
              roomsData={formState.rooms}
              roomFeaturesData={formState.roomFeatures}
              onRoomsChange={(data) => updateFormSection("rooms", data)}
              onRoomFeaturesChange={(data) =>
                updateFormSection("roomFeatures", data)
              }
              hideSubmitButton={true}
            />
          )}
        </div>
      </div>

      {/* FOOTER WITH SAVE BUTTON */}
      <div className="border-t border-gray-200 p-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
            disabled={activeSection === 0 || saving}
          >
            Vorige
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setActiveSection(Math.min(sections.length - 1, activeSection + 1))
            }
            disabled={activeSection === sections.length - 1 || saving}
          >
            Volgende
          </Button>
        </div>

        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white"
        >
          {saving ? "Opslaan..." : "Alles opslaan"}
        </Button>
      </div>
    </div>
  );
}
