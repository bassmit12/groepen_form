// groepen\components\FormSections\rooms-section.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlusCircle,
  Trash2,
  BedDouble,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FeaturesSection from "./features-section";

// Define the Feature interface to match the one in features-section.tsx
interface Feature {
  id: number;
  name: string;
  featuregroup: string | null;
  useForFilter: boolean;
  featureDataType: number;
  defaultValue: string;
  sortOrder: string;
}

interface Room {
  id: string;
  floor: number;
  type: string;
  additionalInfo: string;
  hasSleepingPlaces: boolean;
  sleepingCapacity?: number;
  features: Feature[]; // Now using Feature[] instead of any[]
}

const roomTypes = [
  "Slaapkamer",
  "Woonkamer",
  "Keuken",
  "Badkamer",
  "Eetkamer",
  "Recreatieruimte",
  "Speelkamer",
  "Vergaderruimte",
  "Sauna",
  "Zwembad",
  "Terras",
  "Overig",
];

export default function RoomsSection() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);

  // Generate a unique ID for a new room
  const generateRoomId = () =>
    `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add a new room
  const addRoom = () => {
    const newRoom: Room = {
      id: generateRoomId(),
      floor: 0,
      type: "Slaapkamer",
      additionalInfo: "",
      hasSleepingPlaces: false,
      features: [],
    };
    setRooms([...rooms, newRoom]);
    setExpandedRoom(newRoom.id);
  };

  // Delete a room
  const deleteRoom = (id: string) => {
    setRooms(rooms.filter((room) => room.id !== id));
    if (expandedRoom === id) {
      setExpandedRoom(null);
    }
  };

  // Toggle room expansion
  const toggleRoomExpansion = (id: string) => {
    setExpandedRoom(expandedRoom === id ? null : id);
  };

  // Update room properties
  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(
      rooms.map((room) => (room.id === id ? { ...room, ...updates } : room))
    );
  };

  // Save features for a room - now properly typed
  const saveFeatures = (features: Feature[]) => {
    if (editingRoom) {
      updateRoom(editingRoom.id, { features });
      setEditingRoom(null);
      setShowFeatureDialog(false);
    }
  };

  // Open the features dialog for a specific room
  const openFeaturesDialog = (room: Room) => {
    setEditingRoom(room);
    setShowFeatureDialog(true);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-md shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kamers</h2>
        <Button
          onClick={addRoom}
          className="bg-primary text-white flex gap-2 items-center"
        >
          <PlusCircle size={16} />
          Kamer toevoegen
        </Button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <BedDouble className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Nog geen kamers toegevoegd
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Begin met het toevoegen van een kamer aan deze accommodatie
          </p>
          <Button onClick={addRoom} className="mt-4 bg-primary text-white">
            Eerste kamer toevoegen
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <Card key={room.id} className="border overflow-hidden">
              <CardHeader
                className="p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleRoomExpansion(room.id)}
              >
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-primary" />
                    <span>{room.type}</span>
                    {room.hasSleepingPlaces && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {room.sleepingCapacity || "?"} slaapplaatsen
                      </span>
                    )}
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                      Verdieping {room.floor}
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRoom(room.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Verwijderen</span>
                    </Button>
                    {expandedRoom === room.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedRoom === room.id && (
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`floor-${room.id}`}>Verdieping</Label>
                      <Input
                        id={`floor-${room.id}`}
                        type="number"
                        value={room.floor}
                        onChange={(e) =>
                          updateRoom(room.id, {
                            floor: parseInt(e.target.value) || 0,
                          })
                        }
                        min={-2}
                        className="mt-1"
                      />
                      <div className="mt-1 text-xs text-gray-500">
                        Gebruik negatieve cijfers voor kelderruimtes (-1, -2...)
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`type-${room.id}`}>Kamertype</Label>
                      <Select
                        value={room.type}
                        onValueChange={(value) =>
                          updateRoom(room.id, { type: value })
                        }
                      >
                        <SelectTrigger id={`type-${room.id}`} className="mt-1">
                          <SelectValue placeholder="Selecteer kamertype" />
                        </SelectTrigger>
                        <SelectContent>
                          {roomTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center h-10 mt-6">
                        <Checkbox
                          id={`sleeping-${room.id}`}
                          checked={room.hasSleepingPlaces}
                          onCheckedChange={(checked) =>
                            updateRoom(room.id, {
                              hasSleepingPlaces: !!checked,
                            })
                          }
                          className="mr-2"
                        />
                        <Label htmlFor={`sleeping-${room.id}`}>
                          Heeft slaapplaatsen
                        </Label>
                      </div>

                      {room.hasSleepingPlaces && (
                        <div className="mt-2">
                          <Label htmlFor={`capacity-${room.id}`}>
                            Slaapplaatsen capaciteit
                          </Label>
                          <Input
                            id={`capacity-${room.id}`}
                            type="number"
                            value={room.sleepingCapacity || ""}
                            onChange={(e) =>
                              updateRoom(room.id, {
                                sleepingCapacity:
                                  parseInt(e.target.value) || undefined,
                              })
                            }
                            min={1}
                            className="mt-1"
                            placeholder="Aantal bedden/plaatsen"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`info-${room.id}`}>
                      Aanvullende informatie
                    </Label>
                    <Textarea
                      id={`info-${room.id}`}
                      value={room.additionalInfo}
                      onChange={(e) =>
                        updateRoom(room.id, { additionalInfo: e.target.value })
                      }
                      className="mt-1 min-h-[80px]"
                      placeholder="Aanvullende details over deze kamer..."
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Kamerkenmerken</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => openFeaturesDialog(room)}
                      >
                        <Edit size={14} />
                        Kenmerken beheren
                      </Button>
                    </div>

                    {room.features.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {room.features.map((feature, index) => (
                          <div
                            key={`${room.id}-feature-${index}`}
                            className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded-md"
                          >
                            {feature.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        Geen kenmerken geselecteerd voor deze kamer
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Features Dialog */}
      <Dialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              Selecteer kenmerken voor {editingRoom?.type}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {/* We need to render this conditionally because it depends on editingRoom */}
            {editingRoom && (
              <FeaturesSection
                initialSelected={editingRoom.features}
                onComplete={saveFeatures}
                standalone={true}
              />
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowFeatureDialog(false)}
            >
              Annuleren
            </Button>
            <Button
              className="bg-primary text-white"
              onClick={() => {
                if (editingRoom && editingRoom.features) {
                  saveFeatures(editingRoom.features);
                }
              }}
            >
              Kenmerken opslaan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
