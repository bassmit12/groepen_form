// app/api/accommodations/route.ts
import { NextResponse } from "next/server";
import { getTokenFromApi } from "../token/tokenUtils";

export async function POST(request: Request) {
  try {
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

    // Get the accommodation data from the request
    const accommodationData = await request.json();

    // For development purposes, we can log the received data
    console.log("Received accommodation data:", accommodationData);

    // Check for required fields
    const requiredFields = ["name"];
    const missingFields = requiredFields.filter(
      (field) => !accommodationData[field] || accommodationData[field] === ""
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields,
          details: `The following fields are required: ${missingFields.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Obtain API token
    const token = await getTokenFromApi();
    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain authentication token" },
        { status: 401 }
      );
    }

    // If this is an update (has ID), use PUT, otherwise use POST
    const method = accommodationData.id ? "PUT" : "POST";
    const url = accommodationData.id
      ? `${baseUrl}/${database}/accommodations/${accommodationData.id}`
      : `${baseUrl}/${database}/accommodations`;

    // Create a processed copy of the data
    const processedData = { ...accommodationData };

    // Format time fields as proper ISO date strings in the required format
    if (processedData.arrivalTime) {
      // Use current date (today) for the date part and combine with the time
      const today = new Date().toISOString().split("T")[0];
      const timeStr = processedData.arrivalTime;

      // Create a new date with the current date and the arrival time
      const date = new Date(`${today}T${timeStr}:00`);
      // Format as ISO string (full format with timezone)
      processedData.arrivalTime = date.toISOString();
    }

    if (processedData.departureTime) {
      // Same process for departure time
      const today = new Date().toISOString().split("T")[0];
      const timeStr = processedData.departureTime;

      const date = new Date(`${today}T${timeStr}:00`);
      processedData.departureTime = date.toISOString();
    }

    // Convert string numeric values to actual numbers
    if (
      processedData.personsIncludedInRent &&
      typeof processedData.personsIncludedInRent === "string"
    ) {
      processedData.personsIncludedInRent = parseInt(
        processedData.personsIncludedInRent
      );
    }
    if (
      processedData.numberOfPetsAllowed &&
      typeof processedData.numberOfPetsAllowed === "string"
    ) {
      processedData.numberOfPetsAllowed = parseInt(
        processedData.numberOfPetsAllowed
      );
    }
    if (processedData.code && typeof processedData.code === "string") {
      processedData.code = parseInt(processedData.code);
    }

    // Send data directly to the API without using accommodationToCreate wrapper
    // This is the key change based on the API's expected format
    console.log(
      "Sending data:",
      JSON.stringify(processedData).substring(0, 500) + "..."
    );

    // Send data to the external API
    const response = await fetch(url, {
      method,
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
          error: `Error ${
            method === "POST" ? "creating" : "updating"
          } accommodation`,
          message: response.statusText,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      message: `Accommodation ${
        method === "POST" ? "created" : "updated"
      } successfully`,
      data,
    });
  } catch (error) {
    console.error("Error in accommodations API route:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Also handle GET to retrieve accommodations
export async function GET(request: Request) {
  try {
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

    const token = await getTokenFromApi();
    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain authentication token" },
        { status: 401 }
      );
    }

    // Extract the accommodation ID from the query params if present
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const url = id
      ? `${baseUrl}/${database}/accommodations/${id}`
      : `${baseUrl}/${database}/accommodations`;

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
      console.error(
        `External API error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: `Error fetching accommodations: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in accommodations API route:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
