// rooms-section.tsx
"use client";

import React, { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, Edit, Check, X } from "lucide-react";

type RoomData = {
  id?: number;
  accommodationRoomType: number;
  floor: number;
  position: number;
  suffix: string;
  accommodationId?: number;
};

type RoomFeatureData = {
  roomId?: number;
  featureId: number;
  value: string;
};

interface RoomsSectionProps {
  roomsData: RoomData[];
  roomFeaturesData: RoomFeatureData[];
  onRoomsChange: (data: RoomData[]) => void;
  onRoomFeaturesChange: (data: RoomFeatureData[]) => void;
  hideSubmitButton?: boolean;
}

// Room type options
const roomTypes = [
  { id: 0, name: "Standaard" },
  { id: 1, name: "Slaapkamer" },
  { id: 2, name: "Badkamer" },
  { id: 3, name: "Keuken" },
  { id: 4, name: "Woonkamer" },
];

export default function RoomsSection({
  roomsData,
  // roomFeaturesData not being used yet, but keeping for future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  roomFeaturesData,
  onRoomsChange,
  // onRoomFeaturesChange not being used yet, but keeping for future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRoomFeaturesChange,
  hideSubmitButton = false,
}: RoomsSectionProps) {
  const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newRoom, setNewRoom] = useState<RoomData>({
    accommodationRoomType: 0,
    floor: 0,
    position: roomsData.length,
    suffix: "",
  });

  // Add a new room
  const addRoom = () => {
    if (!newRoom.suffix) {
      alert("Geef een naam voor de kamer op");
      return;
    }

    const updatedRooms = [...roomsData, { ...newRoom }];
    onRoomsChange(updatedRooms);

    // Reset new room form with incremented position
    setNewRoom({
      accommodationRoomType: 0,
      floor: 0,
      position: updatedRooms.length,
      suffix: "",
    });
  };

  // Start editing a room
  const startEdit = (room: RoomData, index: number) => {
    setEditingRoom({ ...room });
    setEditIndex(index);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingRoom(null);
    setEditIndex(null);
  };

  // Save edited room
  const saveEdit = () => {
    if (!editingRoom || editIndex === null) return;

    const updatedRooms = [...roomsData];
    updatedRooms[editIndex] = editingRoom;
    onRoomsChange(updatedRooms);

    // Exit edit mode
    setEditingRoom(null);
    setEditIndex(null);
  };

  // Remove a room
  const removeRoom = (index: number) => {
    const updatedRooms = [...roomsData];
    updatedRooms.splice(index, 1);

    // Update positions for remaining rooms
    for (let i = index; i < updatedRooms.length; i++) {
      updatedRooms[i].position = i;
    }

    onRoomsChange(updatedRooms);
  };

  // Update new room field
  const updateNewRoom = (field: keyof RoomData, value: string | number) => {
    setNewRoom((prev) => ({
      ...prev,
      [field]:
        field === "accommodationRoomType" ||
        field === "floor" ||
        field === "position"
          ? parseInt(value.toString())
          : value,
    }));
  };

  // Update editing room field
  const updateEditingRoom = (field: keyof RoomData, value: string | number) => {
    if (!editingRoom) return;

    setEditingRoom((prev) => ({
      ...prev!,
      [field]:
        field === "accommodationRoomType" ||
        field === "floor" ||
        field === "position"
          ? parseInt(value.toString())
          : value,
    }));
  };

  // Get room type name by id
  const getRoomTypeName = (typeId: number): string => {
    const roomType = roomTypes.find((type) => type.id === typeId);
    return roomType ? roomType.name : "Onbekend";
  };

  // Standalone submission handler (when not using the unified save approach)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // This would typically save to an API, but in the unified form we'll handle this in the parent
    alert("Kamers opgeslagen!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-md shadow"
    >
      <h2 className="text-2xl font-bold">Kamers</h2>

      <div className="space-y-6">
        {/* Add new room card */}
        <Card>
          <CardHeader>
            <CardTitle>Nieuwe kamer toevoegen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roomName">Kamernaam *</Label>
                <Input
                  id="roomName"
                  value={newRoom.suffix}
                  onChange={(e) => updateNewRoom("suffix", e.target.value)}
                  placeholder="Bijv. Slaapkamer 1"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="roomType">Kamertype</Label>
                <Select
                  value={String(newRoom.accommodationRoomType)}
                  onValueChange={(value) =>
                    updateNewRoom("accommodationRoomType", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecteer type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type.id} value={String(type.id)}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="floor">Verdieping</Label>
                <Input
                  id="floor"
                  type="number"
                  min="0"
                  value={newRoom.floor}
                  onChange={(e) => updateNewRoom("floor", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="position">Positie</Label>
                <Input
                  id="position"
                  type="number"
                  min="0"
                  value={newRoom.position}
                  onChange={(e) => updateNewRoom("position", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button type="button" onClick={addRoom} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Kamer toevoegen
            </Button>
          </CardContent>
        </Card>

        {/* Rooms table */}
        <div>
          <h3 className="text-lg font-medium mb-2">Kamers</h3>

          {roomsData.length === 0 ? (
            <div className="text-gray-500">Geen kamers toegevoegd</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Naam</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Verdieping</TableHead>
                  <TableHead>Positie</TableHead>
                  <TableHead className="w-24">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomsData.map((room, index) => (
                  <TableRow key={index}>
                    {editIndex === index ? (
                      // Editing mode
                      <>
                        <TableCell>
                          <Input
                            value={editingRoom?.suffix || ""}
                            onChange={(e) =>
                              updateEditingRoom("suffix", e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={String(
                              editingRoom?.accommodationRoomType || 0
                            )}
                            onValueChange={(value) =>
                              updateEditingRoom("accommodationRoomType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {roomTypes.map((type) => (
                                <SelectItem
                                  key={type.id}
                                  value={String(type.id)}
                                >
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={editingRoom?.floor || 0}
                            onChange={(e) =>
                              updateEditingRoom("floor", e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={editingRoom?.position || 0}
                            onChange={(e) =>
                              updateEditingRoom("position", e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button type="button" size="sm" onClick={saveEdit}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={cancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      // Display mode
                      <>
                        <TableCell>{room.suffix}</TableCell>
                        <TableCell>
                          {getRoomTypeName(room.accommodationRoomType)}
                        </TableCell>
                        <TableCell>{room.floor}</TableCell>
                        <TableCell>{room.position}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(room, index)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeRoom(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {!hideSubmitButton && (
        <Button type="submit" className="mt-4">
          Kamers opslaan
        </Button>
      )}
    </form>
  );
}
