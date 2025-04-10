// app/api/countries/route.ts
import { NextResponse } from "next/server";
import { getTokenFromApi } from "../token/tokenUtils";

export async function GET() {
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

    const response = await fetch(`${baseUrl}/${database}/countries`, {
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
        { error: `Error fetching countries: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in countries API route:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
