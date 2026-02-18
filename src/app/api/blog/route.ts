// API Route Handler for Blog Posts
// Proxies requests to the FastAPI backend

import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");
    const slug = searchParams.get("slug");

    let url = `${BACKEND_URL}/api/blog`;
    
    if (slug) {
      url = `${url}/${slug}`;
    } else {
      const params = new URLSearchParams();
      if (featured) params.append("featured", featured);
      if (limit) params.append("limit", limit);
      if (params.toString()) url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch blog posts" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Blog API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
