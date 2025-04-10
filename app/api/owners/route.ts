// app/api/owners/route.ts
import { NextResponse } from "next/server";
import { getTokenFromApi } from "../token/tokenUtils";

export async function GET() {
  try {
    // Get API configuration from environment variables
    const baseUrl = process.env.NEXT_BOOKZO_API_BASE_URL;
    const database = process.env.NEXT_BOOKZO_API_DATABASE;
    const subscriptionKey = process.env.NEXT_BOOKZO_API_SUBSCRIPTION_KEY;

    // Check if required environment variables are defined
    if (!baseUrl || !database || !subscriptionKey) {
      console.error(
        "Missing required environment variables for API configuration",
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Get a fresh token
    const token = await getTokenFromApi();
    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain authentication token" },
        { status: 401 },
      );
    }

    const response = await fetch(`${baseUrl}/${database}/owners`, {
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
        `External API error: ${response.status} ${response.statusText}`,
      );
      return NextResponse.json(
        { error: `Error fetching owners: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in owners API route:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const baseUrl = process.env.NEXT_BOOKZO_API_BASE_URL;
    const database = process.env.NEXT_BOOKZO_API_DATABASE;
    const subscriptionKey = process.env.NEXT_BOOKZO_API_SUBSCRIPTION_KEY;

    if (!baseUrl || !database || !subscriptionKey) {
      console.error(
        "Missing required environment variables for API configuration",
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const token = await getTokenFromApi();
    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain authentication token" },
        { status: 401 },
      );
    }

    const ownerData = await request.json();

    const response = await fetch(`${baseUrl}/${database}/owners`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-subscription-key": subscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ownerData),
    });

    if (!response.ok) {
      console.error(
        `External API error: ${response.status} ${response.statusText}`,
      );
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return NextResponse.json(
        { error: `Error creating owner: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in create owner API route:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
