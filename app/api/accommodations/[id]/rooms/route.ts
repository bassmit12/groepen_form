// app/api/accommodations/[id]/rooms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTokenFromApi } from "../../../token/tokenUtils";

// Define the RouteContext type with a Promise for params
type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET handler for retrieving rooms for a specific accommodation
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const accommodationId = params.id;
    const baseUrl = process.env.NEXT_BOOKZO_API_BASE_URL;
    const database = process.env.NEXT_BOOKZO_API_DATABASE;
    const subscriptionKey = process.env.NEXT_BOOKZO_API_SUBSCRIPTION_KEY;

    if (!baseUrl || !database || !subscriptionKey) {
      console.error(
        "Missing required environment variables for API configuration"
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get token for API auth
    const token = await getTokenFromApi();
    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain authentication token" },
        { status: 401 }
      );
    }

    // Call the external API to get rooms for this accommodation
    const url = `${baseUrl}/${database}/accommodations/${accommodationId}/rooms`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-subscription-key": subscriptionKey,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `External API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return NextResponse.json(
        {
          error: `Error fetching rooms for accommodation ${accommodationId}`,
          message: response.statusText,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in accommodations rooms API route:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST handler for creating rooms for a specific accommodation
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const accommodationId = params.id;
    const baseUrl = process.env.NEXT_BOOKZO_API_BASE_URL;
    const database = process.env.NEXT_BOOKZO_API_DATABASE;
    const subscriptionKey = process.env.NEXT_BOOKZO_API_SUBSCRIPTION_KEY;

    if (!baseUrl || !database || !subscriptionKey) {
      console.error(
        "Missing required environment variables for API configuration"
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get room data from request
    const roomData = await request.json();
    console.log("Received room data:", roomData);

    // Get token for API auth
    const token = await getTokenFromApi();
    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain authentication token" },
        { status: 401 }
      );
    }

    // Ensure accommodation ID is set on the room data
    const processedData = Array.isArray(roomData)
      ? roomData.map((room) => ({
          ...room,
          accommodationId: parseInt(accommodationId),
        }))
      : { ...roomData, accommodationId: parseInt(accommodationId) };

    // Call the external API to create rooms for this accommodation
    const url = `${baseUrl}/${database}/accommodations/${accommodationId}/rooms`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-subscription-key": subscriptionKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(processedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `External API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return NextResponse.json(
        {
          error: `Error creating rooms for accommodation ${accommodationId}`,
          message: response.statusText,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      message: "Rooms created successfully",
      data,
    });
  } catch (error) {
    console.error("Error in accommodations rooms API route:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT handler for updating rooms for a specific accommodation
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const accommodationId = params.id;
    const baseUrl = process.env.NEXT_BOOKZO_API_BASE_URL;
    const database = process.env.NEXT_BOOKZO_API_DATABASE;
    const subscriptionKey = process.env.NEXT_BOOKZO_API_SUBSCRIPTION_KEY;

    if (!baseUrl || !database || !subscriptionKey) {
      console.error(
        "Missing required environment variables for API configuration"
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get room data from request
    const roomData = await request.json();
    console.log("Received room data for update:", roomData);

    // Get token for API auth
    const token = await getTokenFromApi();
    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain authentication token" },
        { status: 401 }
      );
    }

    // Ensure accommodation ID is set on the room data
    const processedData = Array.isArray(roomData)
      ? roomData.map((room) => ({
          ...room,
          accommodationId: parseInt(accommodationId),
        }))
      : { ...roomData, accommodationId: parseInt(accommodationId) };

    // Call the external API to update rooms for this accommodation
    const url = `${baseUrl}/${database}/accommodations/${accommodationId}/rooms`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-subscription-key": subscriptionKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(processedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `External API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return NextResponse.json(
        {
          error: `Error updating rooms for accommodation ${accommodationId}`,
          message: response.statusText,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      message: "Rooms updated successfully",
      data,
    });
  } catch (error) {
    console.error("Error in accommodations rooms API route:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
