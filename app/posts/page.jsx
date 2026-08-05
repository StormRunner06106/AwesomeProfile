"use client";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FixedButton from "@/components/FixedButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import PostCard from "./components/PostCard";

const POSTS_PER_PAGE = 10;

export default function Page() {
  let [posts, setPosts] = useState([]);
  let [page, setPage] = useState(1);
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBlueskyPosts() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/bluesky", {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch posts from Bluesky");
        }

        setPosts(data.posts);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch posts from Bluesky", err);
          setError(err.message || "Failed to fetch posts from Bluesky");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBlueskyPosts();

    return () => controller.abort();
  }, []);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const paginatedPosts = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  return (
    <>
      <main className="overflow-hidden">
        <FixedButton href="/#posts">
          <FontAwesomeIcon icon={faChevronLeft} className="text-black pr-10" />
        </FixedButton>
        <div className="w-full flex flex-col items-center mt-10">
          <div className="w-full px-16 flex justify-between">
            <h1 className="text-4xl font-bold mb-4 mt-8 text-left">Posts</h1>
            <h1 className="text-4xl font-bold mb-4 mt-8 text-left">
              {posts.length} items
            </h1>
          </div>
          <div className="grid w-full grid-cols-1 gap-6 px-6 mb-10 sm:grid-cols-2 sm:px-10 lg:grid-cols-3 lg:px-16 xl:grid-cols-4">
            {loading && <div>Loading posts...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading &&
              !error &&
              paginatedPosts.map((post, index) => (
                <PostCard
                  post={post}
                  index={(page - 1) * POSTS_PER_PAGE + index}
                  key={post.post.uri}
                />
              ))}
          </div>
        </div>
        {/* Pagination controls */}
        <div className="flex justify-center items-center gap-2 mb-10">
          <Button
            variation="secondary"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </Button>
          <span className="mx-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variation="secondary"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </main>
    </>
  );
}
