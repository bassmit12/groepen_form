// groepen\app\api\features\route.ts
import { NextResponse } from "next/server";
import { getTokenFromApi } from "../token/tokenUtils";

// Helper function to get the current token - directly using the utility function
async function getToken(): Promise<string | null> {
  try {
    const token = await getTokenFromApi();

    if (!token) {
      console.error("Failed to obtain token from utility");
      return null;
    }

    // Only log first 20 chars and last 5 chars of the token for security
    const tokenPreview = `${token.substring(0, 20)}...${token.substring(token.length - 5)}`;
    console.log("Features route received token preview:", tokenPreview);

    return token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}

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
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain authentication token" },
        { status: 401 },
      );
    }

    console.log(`Fetching features from ${baseUrl}/${database}/features`);

    const response = await fetch(`${baseUrl}/${database}/features`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-subscription-key": subscriptionKey,
        Accept: "application/json",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error(
        `External API error: ${response.status} ${response.statusText}`,
      );
      try {
        const errorText = await response.text();
        console.error("Error response:", errorText);
      } catch {
        console.error("Could not read error response");
      }

      return NextResponse.json(
        { error: `Error fetching features: ${response.statusText}` },
        { status: response.status },
      );
    }

    // Log the raw response for debugging
    const responseText = await response.text();
    console.log("Raw API response:", responseText.substring(0, 200) + "...");

    // Parse the response text to JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing API response as JSON:", error);
      return NextResponse.json(
        { error: "Invalid response format from API" },
        { status: 500 },
      );
    }

    // Validate the response structure
    if (!data || typeof data !== "object") {
      console.error("API response is not an object:", data);
      return NextResponse.json(
        { error: "Invalid API response format" },
        { status: 500 },
      );
    }

    // Check if results exists and is an array
    if (!data.results || !Array.isArray(data.results)) {
      console.error("API response doesn't contain a results array:", data);

      // If the structure is different, try to adapt
      if (Array.isArray(data)) {
        // If the response itself is an array, use it directly
        console.log("API response is an array, using it as results");
        data = { results: data, total: data.length };
      } else {
        // For any other format, wrap the data in a results array
        data = { results: [data], total: 1 };
      }
    }

    console.log(`Successfully fetched ${data.results?.length || 0} features`);

    // Log the first few features to verify data structure
    if (data.results && data.results.length > 0) {
      console.log(
        "First 3 features:",
        JSON.stringify(data.results.slice(0, 3), null, 2),
      );

      // Log unique feature groups
      // Fix the any type by specifying a feature interface
      interface Feature {
        featuregroup?: string;
      }

      const groups = [
        ...new Set(
          data.results.map((f: Feature) => f.featuregroup || "Unknown"),
        ),
      ];
      console.log(
        `Found ${groups.length} feature groups:`,
        groups.slice(0, 10).join(", "),
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in features API route:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
