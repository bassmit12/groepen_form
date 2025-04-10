// groepen\app\api\token\route.ts
import { NextResponse } from "next/server";
import { getTokenFromApi } from "./tokenUtils";

export async function GET() {
  try {
    const accessToken = await getTokenFromApi();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Failed to refresh token" },
        { status: 401 },
      );
    }

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Error in token API route:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
