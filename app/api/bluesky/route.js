import { NextResponse } from "next/server";
import { getAuthorPosts } from "@/lib/bluesky";

const DEFAULT_BLUESKY_HANDLE = "stormrunner06106.bsky.social";

export async function GET() {
  const handle =
    process.env.BLUESKY_HANDLE ||
    process.env.NEXT_PUBLIC_BLUESKY_HANDLE ||
    DEFAULT_BLUESKY_HANDLE;

  try {
    const posts = await getAuthorPosts(handle);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error(`Failed to fetch Bluesky posts for ${handle}`, error);
    return NextResponse.json(
      { error: "Bluesky posts are temporarily unavailable." },
      { status: 502 }
    );
  }
}
