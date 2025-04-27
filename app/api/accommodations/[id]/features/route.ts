// app/api/accommodations/[id]/features/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTokenFromApi } from "../../../token/tokenUtils";

// Define the RouteContext type with a Promise for params
type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET handler for retrieving features for a specific accommodation
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

    // Call the external API to get features for this accommodation
    const url = `${baseUrl}/${database}/accommodations/${accommodationId}/features`;

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
          error: `Error fetching features for accommodation ${accommodationId}`,
          message: response.statusText,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in accommodations features API route:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT handler for updating features for a specific accommodation
// This endpoint supports setting quantity values for features
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

    // Get feature data from request
    const featureData = await request.json();
    console.log("Received feature data for update:", featureData);

    // Get token for API auth
    const token = await getTokenFromApi();
    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain authentication token" },
        { status: 401 }
      );
    }

    // Ensure accommodation ID is set on each feature and parse quantities
    const processedData = Array.isArray(featureData)
      ? featureData.map((feature) => ({
          ...feature,
          accommodationID: parseInt(accommodationId),
          featureID: feature.featureID,
          // Ensure the value field is set - it can contain quantity information
          value: feature.value || "1",
        }))
      : {
          ...featureData,
          accommodationID: parseInt(accommodationId),
          featureID: featureData.featureID,
          value: featureData.value || "1",
        };

    console.log("Processed feature data for API:", processedData);

    // Call the external API to update features for this accommodation
    const url = `${baseUrl}/${database}/accommodations/${accommodationId}/features`;

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

    // Log the raw response for debugging
    console.log(`Response status: ${response.status} ${response.statusText}`);

    const responseText = await response.text();
    console.log(`Response body: ${responseText}`);

    // Check if the response is empty or not JSON
    if (!responseText.trim()) {
      // Handle empty response case
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: "Features updated successfully (no content returned)",
          data: processedData, // Return the processed data we sent
        });
      } else {
        return NextResponse.json(
          {
            error: `Error updating features: ${response.status} ${response.statusText}`,
            message: "Empty response from external API",
          },
          { status: response.status }
        );
      }
    }

    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);

      // If the response was successful but not JSON, still return success
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: "Features updated successfully (non-JSON response)",
          data: processedData, // Return the processed data we sent
          rawResponse: responseText,
        });
      } else {
        return NextResponse.json(
          {
            error: `Error updating features: Invalid JSON response`,
            details: responseText,
          },
          { status: 500 }
        );
      }
    }

    // If we got here, we have a valid JSON response
    if (!response.ok) {
      console.error(
        `External API error: ${response.status} ${response.statusText}`,
        data
      );
      return NextResponse.json(
        {
          error: `Error updating features for accommodation ${accommodationId}`,
          message: response.statusText,
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Features updated successfully",
      data,
    });
  } catch (error) {
    console.error("Error in accommodations features API route:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
