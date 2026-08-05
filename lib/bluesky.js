const BLUESKY_PUBLIC_API = "https://public.api.bsky.app";

export async function getAuthorPosts(actor) {
  const params = new URLSearchParams({
    actor,
    filter: "posts_no_replies",
    limit: "100",
  });
  const response = await fetch(
    `${BLUESKY_PUBLIC_API}/xrpc/app.bsky.feed.getAuthorFeed?${params}`,
    { next: { revalidate: 300 } }
  );

  if (!response.ok) {
    throw new Error(`Bluesky returned HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.feed || [];
}
