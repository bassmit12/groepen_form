// groepen\app\api\token\route.ts
import { NextResponse } from "next/server";

// Simple token cache
type TokenCache = {
  accessToken: string;
  expiresAt: number; // timestamp when token expires
};

// In-memory cache (this will reset on server restart)
let tokenCache: TokenCache | null = null;

// Buffer time before expiration to refresh token (5 minutes)
const REFRESH_BUFFER = 5 * 60 * 1000;

export async function GET() {
  try {
    const currentTime = Date.now();

    // Check if we have a valid cached token
    if (tokenCache && tokenCache.expiresAt > currentTime + REFRESH_BUFFER) {
      console.log("Using cached token");
      console.log(
        "Token preview:",
        `${tokenCache.accessToken.substring(0, 20)}...${tokenCache.accessToken.substring(tokenCache.accessToken.length - 5)}`,
      );
      return NextResponse.json({ accessToken: tokenCache.accessToken });
    }

    // Get API configuration from environment variables
    const baseUrl = process.env.NEXT_BOOKZO_API_BASE_URL;
    const subscriptionKey = process.env.NEXT_BOOKZO_API_SUBSCRIPTION_KEY;
    const clientId = process.env.NEXT_BOOKZO_API_CLIENT_ID;
    const clientSecret = process.env.NEXT_BOOKZO_API_CLIENT_SECRET;

    // Check if all required environment variables are defined
    if (!baseUrl || !subscriptionKey || !clientId || !clientSecret) {
      console.error("Missing required environment variables for token refresh");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    console.log("Refreshing token...");

    // Create a FormData body using the URLSearchParams approach for server-side
    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    formData.append("client_id", clientId);
    formData.append("client_secret", clientSecret);

    // Request new token
    const response = await fetch(`${baseUrl}/token`, {
      method: "POST",
      headers: {
        "x-subscription-key": subscriptionKey,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      console.error(
        `Token refresh failed: ${response.status} ${response.statusText}`,
      );
      try {
        const errorBody = await response.text();
        console.error("Error response:", errorBody);
      } catch {
        console.error("Could not read error response");
      }

      return NextResponse.json(
        { error: "Failed to refresh token" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Calculate when token expires (convert expires_in from seconds to milliseconds)
    const expiresAt = currentTime + data.expires_in * 1000;

    // Update token cache
    tokenCache = {
      accessToken: data.access_token,
      expiresAt: expiresAt,
    };

    console.log(`Token refreshed, expires in ${data.expires_in} seconds`);
    console.log(
      "Token preview:",
      `${data.access_token.substring(0, 20)}...${data.access_token.substring(data.access_token.length - 5)}`,
    );

    return NextResponse.json({ accessToken: data.access_token });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
