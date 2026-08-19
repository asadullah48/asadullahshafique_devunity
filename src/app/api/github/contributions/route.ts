import { NextResponse } from "next/server";

const GITHUB_USERNAME = "asadullah48";
const CONTRIBUTIONS_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

// Contribution counts change at most a few times a day — cache for an hour.
export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch(CONTRIBUTIONS_API, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Contributions API unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 502 }
    );
  }
}
