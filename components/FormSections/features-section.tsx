"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, PlusCircle, Loader2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Define the Feature interface
interface Feature {
  id: number;
  name: string;
  featuregroup: string | null;
  useForFilter: boolean;
  featureDataType: number;
  defaultValue: string;
  sortOrder: string;
}

// Add new props interface
interface FeaturesSectionProps {
  initialSelected?: Feature[];
  onComplete?: (selectedFeatures: Feature[]) => void;
  standalone?: boolean;
}

export default function FeaturesSection({
  initialSelected = [],
  onComplete,
  standalone = false,
}: FeaturesSectionProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [filteredFeatures, setFilteredFeatures] = useState<Feature[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with initialSelected if provided
  const [selectedFeatures, setSelectedFeatures] =
    useState<Feature[]>(initialSelected);

  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Helper function to extract and sort feature groups
  const extractGroups = (features: Feature[]): string[] => {
    return [
      ...new Set(features.map((f) => f?.featuregroup || "Unknown")),
    ].sort();
  };

  // Fetch features on component mount
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        // Only use the real API endpoint
        const response = await fetch("/api/features");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          setFeatures(data.results);
          setFilteredFeatures(data.results);

          // Set the first group as active by default if we have any features
          if (data.results.length > 0) {
            // Explicitly type the groups array
            const groups: string[] = extractGroups(data.results);
            if (groups.length > 0) {
              setActiveGroup(groups[0]);
            }
          }

          console.log(`Loaded ${data.results.length} features`);
        } else {
          console.error("Invalid API response format:", data);
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        console.error("Error fetching features:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  // Filter features based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFeatures(features);
      setIsSearchMode(false);

      // If we have features but no active group yet, set the first group as active
      if (features.length > 0 && !activeGroup) {
        const groups: string[] = extractGroups(features);
        if (groups.length > 0) {
          setActiveGroup(groups[0]);
        }
      }
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = features.filter(
        (feature) =>
          (feature.name?.toLowerCase() || "").includes(query) ||
          (feature.featuregroup?.toLowerCase() || "").includes(query),
      );
      setFilteredFeatures(filtered);
      setIsSearchMode(true);
    }
  }, [searchQuery, features, activeGroup]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchMode(false);
  };

  const handleFeatureSelect = (feature: Feature) => {
    setSelectedFeatures((prev) => {
      // Check if feature is already selected
      const isSelected = prev.some((item) => item.id === feature.id);

      if (isSelected) {
        // Remove feature if already selected
        return prev.filter((item) => item.id !== feature.id);
      } else {
        // Add feature if not selected
        return [...prev, feature];
      }
    });
  };

  const createNewFeature = () => {
    // This would typically make an API call to create a new feature
    const newFeature: Feature = {
      id: Math.floor(Math.random() * -1000), // Temporary negative ID
      name: searchQuery,
      featuregroup: "Custom Features",
      useForFilter: true,
      featureDataType: 0,
      defaultValue: "",
      sortOrder: "999",
    };

    setFeatures((prev) => [...prev, newFeature]);
    setSelectedFeatures((prev) => [...prev, newFeature]);
    setSearchQuery("");
  };

  // Group features by featuregroup with null safety
  const groupedFeatures: Record<string, Feature[]> = {};
  filteredFeatures.forEach((feature) => {
    const group = feature.featuregroup || "Unknown";
    if (!groupedFeatures[group]) {
      groupedFeatures[group] = [];
    }
    groupedFeatures[group].push(feature);
  });

  // Sort groups by name and ensure we're working with strings
  const sortedGroups: string[] = Object.keys(groupedFeatures).sort();

  const handleGroupSelect = (group: string) => {
    setActiveGroup(group === activeGroup ? null : group);
  };

  // Updated to support onComplete callback
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Selected features:", selectedFeatures);

    if (onComplete) {
      onComplete(selectedFeatures);
    } else {
      alert("Features saved! Check console for details.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={standalone ? "" : "space-y-6 p-6 bg-white rounded-md shadow"}
    >
      {!standalone && <h2 className="text-2xl font-bold">Features</h2>}

      {/* Search bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search features..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10 py-2"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Selected Features */}
      {selectedFeatures.length > 0 && (
        <div className="mt-4">
          <Label className="font-medium mb-2 block">
            Selected Features ({selectedFeatures.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedFeatures.map((feature) => (
              <div
                key={`selected-${feature.id}`}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{feature.name}</span>
                <button
                  type="button"
                  onClick={() => handleFeatureSelect(feature)}
                  className="text-primary hover:text-primary/70"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature results */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
            <span className="ml-2">Loading features...</span>
          </div>
        ) : error ? (
          <p className="text-red-500 p-4 bg-red-50 rounded-md">
            Error: {error}
          </p>
        ) : filteredFeatures.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-gray-50">
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? `No features found for "${searchQuery}"`
                : "No features available"}
            </p>
            {searchQuery && (
              <Button
                type="button"
                onClick={createNewFeature}
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Create {searchQuery} as a new feature
              </Button>
            )}
          </div>
        ) : isSearchMode ? (
          // Search results view - show all matches across groups
          <div className="border rounded-md overflow-hidden">
            <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
              <div className="font-medium text-sm">
                Search Results: {filteredFeatures.length} features found
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="text-sm"
              >
                <X className="h-4 w-4 mr-1" /> Clear Search
              </Button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {sortedGroups.map((group) => (
                <div key={group} className="border-b last:border-b-0">
                  <div className="px-4 py-2 bg-gray-50 font-medium text-sm">
                    {group}
                  </div>
                  {groupedFeatures[group]?.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 border-t first:border-t-0"
                    >
                      <Checkbox
                        id={`feature-${feature.id}`}
                        checked={selectedFeatures.some(
                          (f) => f.id === feature.id,
                        )}
                        onCheckedChange={() => handleFeatureSelect(feature)}
                      />
                      <label
                        htmlFor={`feature-${feature.id}`}
                        className="ml-2 text-sm cursor-pointer flex-1"
                      >
                        {feature.name}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Normal browsing view with two columns
          <div className="flex border rounded-md overflow-hidden">
            {/* Group navigation */}
            <div className="w-1/3 bg-gray-50 border-r">
              <div className="p-2 font-medium text-sm text-gray-500">
                Feature Groups ({sortedGroups.length})
              </div>
              <div className="max-h-80 overflow-y-auto">
                {sortedGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => handleGroupSelect(group)}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      activeGroup === group
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {group} ({groupedFeatures[group]?.length || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Feature list */}
            <div className="w-2/3">
              <div className="p-2 font-medium text-sm text-gray-500">
                {activeGroup
                  ? `${activeGroup} Features (${groupedFeatures[activeGroup]?.length || 0})`
                  : "Features"}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {activeGroup ? (
                  (groupedFeatures[activeGroup] || []).map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 border-t first:border-t-0"
                    >
                      <Checkbox
                        id={`feature-${feature.id}`}
                        checked={selectedFeatures.some(
                          (f) => f.id === feature.id,
                        )}
                        onCheckedChange={() => handleFeatureSelect(feature)}
                      />
                      <label
                        htmlFor={`feature-${feature.id}`}
                        className="ml-2 text-sm cursor-pointer flex-1"
                      >
                        {feature.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Select a group to view features
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Only show the Save button when not in standalone mode */}
      {!standalone && (
        <Button type="submit" className="bg-primary text-white">
          Save Features
        </Button>
      )}
    </form>
  );
}
