import { NextResponse } from "next/server";

const API_URL = "http://37.27.120.45:5901/api/admin/coinindex/mcmsignals";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const listOnly = searchParams.get("listOnly");
    const source_id = searchParams.get("source_id");

    // Build backend URL with query params
    let externalUrl = API_URL;
    const params = new URLSearchParams();

    if (listOnly) {
      params.set("listOnly", listOnly);
    }
    if (source_id) {
      params.set("source_id", source_id);
    }

    const queryString = params.toString();
    if (queryString) {
      externalUrl = `${API_URL}?${queryString}`;
    }

    const response = await fetch(externalUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch data from external API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching mcmsignals data:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
