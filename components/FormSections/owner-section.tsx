// OwnerSection.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
import { Check, X, Loader2, Plus } from "lucide-react";

// Define interfaces for data models
interface Owner {
  id: number;
  contactPerson: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  countryId: number;
  languageId: number;
}

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

interface OwnerFormData {
  owner: string;
  ownerId?: number;
  availableInPortal: boolean;
  commissionAgreements: string;
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
  // Form state
  const [formData, setFormData] = useState<OwnerFormData>({
    owner: "",
    availableInPortal: false,
    commissionAgreements: "",
  });

  // State for managing the owner list and selection
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // State for the new owner form
  const [isCreatingOwner, setIsCreatingOwner] = useState(false);
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

  // Fetch owners when component mounts
  useEffect(() => {
    fetchOwners();
    fetchCountries();
    fetchLanguages();
  }, []);

  // Filter owners based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOwners([]);
    } else {
      const filtered = owners.filter(
        (owner) =>
          owner.contactPerson
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          owner.companyName?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredOwners(filtered);
    }
  }, [searchQuery, owners]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setIsSearching(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch owners from API
  const fetchOwners = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/owners");
      if (response.ok) {
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          setOwners(data.results);
        }
      }
    } catch (error) {
      console.error("Error fetching owners:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Handle input changes for main form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle input changes for new owner form
  const handleNewOwnerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
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

  // Focus handler for search input
  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  // Handle search input changes - UPDATED
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // If field is being cleared, also clear the selected owner
    if (value === "" && selectedOwner) {
      setSelectedOwner(null);
      setFormData((prev) => ({
        ...prev,
        owner: "",
        ownerId: undefined,
      }));
    }

    setIsSearching(true);
  };

  // Clear selected owner
  const clearSelectedOwner = () => {
    setSelectedOwner(null);
    setFormData((prev) => ({
      ...prev,
      owner: "",
      ownerId: undefined,
    }));
    setSearchQuery("");
  };

  // Handle owner selection
  const handleSelectOwner = (owner: Owner) => {
    setSelectedOwner(owner);
    setFormData((prev) => ({
      ...prev,
      owner: owner.companyName || owner.contactPerson,
      ownerId: owner.id,
    }));
    setIsSearching(false);
    setSearchQuery("");
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
        setOwners((prev) => [...prev, newOwner]);
        handleSelectOwner(newOwner);
        setIsCreatingOwner(false);
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
      } else {
        console.error("Error creating owner:", await response.text());
      }
    } catch (error) {
      console.error("Error creating owner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Owner section data:", formData);
    alert("Form submitted! Check console for data.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-md shadow"
    >
      <h2 className="text-2xl font-bold">Owner</h2>

      {/* Owner Field - UPDATED */}
      <div className="relative">
        <Label htmlFor="ownerSearch">Owner</Label>
        <div className="flex gap-2 mt-1">
          <div className="relative flex-1">
            <Input
              id="ownerSearch"
              placeholder="Search or select an owner"
              value={
                selectedOwner
                  ? selectedOwner.companyName || selectedOwner.contactPerson
                  : searchQuery
              }
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              className="w-full pr-8" // Add padding for the clear button
            />

            {/* Clear button - NEW */}
            {selectedOwner && (
              <button
                type="button"
                onClick={clearSelectedOwner}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}

            {isSearching && (
              <div
                ref={searchResultsRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                {filteredOwners.length > 0 ? (
                  filteredOwners.map((owner) => (
                    <div
                      key={owner.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => handleSelectOwner(owner)}
                    >
                      <div>
                        <div className="font-medium">
                          {owner.companyName || owner.contactPerson}
                        </div>
                        {owner.companyName && (
                          <div className="text-sm text-gray-600">
                            {owner.contactPerson}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          {owner.email}
                        </div>
                      </div>
                      <Check className="h-5 w-5 text-gray-400" />
                    </div>
                  ))
                ) : searchQuery ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No owners found for {searchQuery}.
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Start typing to search for owners.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsSearching(true)}
          >
            Select Owner
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            className="text-white"
            onClick={() => setIsCreatingOwner(!isCreatingOwner)}
          >
            {isCreatingOwner ? "Cancel" : "Create New Owner"}
          </Button>
        </div>
      </div>

      {/* New Owner Form */}
      {isCreatingOwner && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-4 mt-4">
          <h3 className="font-medium text-lg">Create New Owner</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={newOwnerData.firstName}
                onChange={handleNewOwnerInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={newOwnerData.lastName}
                onChange={handleNewOwnerInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={newOwnerData.companyName}
                onChange={handleNewOwnerInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="phone">Phone</Label>
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
              <Label htmlFor="streetname">Street</Label>
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
                  placeholder="No."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={newOwnerData.postalCode}
                onChange={handleNewOwnerInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={newOwnerData.city}
                onChange={handleNewOwnerInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="countryId">Country</Label>
              <Select
                onValueChange={(value) =>
                  handleNewOwnerSelectChange("countryId", value)
                }
                defaultValue={String(newOwnerData.countryId)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select country" />
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
              <Label htmlFor="languageId">Language</Label>
              <Select
                onValueChange={(value) =>
                  handleNewOwnerSelectChange("languageId", value)
                }
                defaultValue={String(newOwnerData.languageId)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select language" />
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

          <div className="pt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreatingOwner(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateOwner}
              disabled={isLoading}
              className="bg-primary text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Create Owner
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Available in Owner Portal Toggle */}
      <div className="flex items-center space-x-2">
        <Input
          id="availableInPortal"
          name="availableInPortal"
          type="checkbox"
          checked={formData.availableInPortal}
          onChange={handleInputChange}
          className="h-4 w-4"
        />
        <Label htmlFor="availableInPortal">Available in owner portal</Label>
      </div>

      {/* Commission Agreements */}
      <div>
        <Label htmlFor="commissionAgreements">Commission agreements</Label>
        <div className="flex flex-col gap-2">
          <Input
            id="commissionAgreements"
            name="commissionAgreements"
            type="text"
            placeholder="Enter commission details"
            value={formData.commissionAgreements}
            onChange={handleInputChange}
          />
          <Button
            type="button"
            variant="default"
            size="sm"
            className="self-start text-white"
          >
            Add Agreement
          </Button>
        </div>
      </div>

      {/* Knowledge Base Link */}
      <div className="text-sm">
        <Link
          href="/knowledge-base"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Go to knowledge base article
        </Link>
      </div>

      <Button type="submit" className="bg-primary text-white">
        Save
      </Button>
    </form>
  );
}
