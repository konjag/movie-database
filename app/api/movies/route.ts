import { NextRequest } from "next/server";

const OMDB_API_URL = "https://www.omdbapi.com";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const id = searchParams.get("id");
  const page = searchParams.get("page") ?? "1";
  const year = searchParams.get("year");

  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    return Response.json(
      { Response: "False", Error: "OMDb API key is not configured" },
      { status: 500 }
    );
  }

  const omdbSearchParams = new URLSearchParams();
  omdbSearchParams.set("apikey", apiKey);

  if (id) {
    omdbSearchParams.set("i", id);
    omdbSearchParams.set("plot", "full");
  } else if (query) {
    omdbSearchParams.set("s", query);
    omdbSearchParams.set("page", page);
    if (year) {
      omdbSearchParams.set("y", year);
    }
  } else {
    return Response.json(
      { Response: "False", Error: "Missing query or id parameter" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${OMDB_API_URL}/?${omdbSearchParams.toString()}`);

    if (!response.ok) {
      return Response.json(
        {
          Response: "False",
          Error: `OMDb API returned status ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch {
    return Response.json(
      { Response: "False", Error: "Network error while contacting OMDb API" },
      { status: 503 }
    );
  }
}
