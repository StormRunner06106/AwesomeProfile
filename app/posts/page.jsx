"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Image from "next/image";
import Hr from "@/components/Hr";
import FixedButton from "@/components/FixedButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import PostCard from "./components/PostCard";
import bluesky from "@/lib/bluesky.js";

const POSTS_PER_PAGE = 10;

export default function Page() {
  let [posts, setPosts] = useState([]);
  let [page, setPage] = useState(1);
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlueskyPosts() {
      setLoading(true);
      setError(null);
      try {
        const handle = process.env.NEXT_PUBLIC_BLUESKY_HANDLE;
        const appPassword = "Griffindor!@#$1234";
        const { login, getMyPosts } = await import("@/lib/bluesky.js");
        const agent = await login(handle, appPassword);
        const blueskyPosts = await getMyPosts(agent);
        setPosts(blueskyPosts);
      } catch (err) {
        setError("Failed to fetch posts from Bluesky");
      } finally {
        setLoading(false);
      }
    }
    fetchBlueskyPosts();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  console.log(page, paginatedPosts);

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
          <div className="w-full flex flex-row flex-wrap items-start px-16 mb-10 cursor-pointer">
            {loading && <div>Loading posts...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading &&
              !error &&
              paginatedPosts.map((post, index) => (
                <PostCard post={post} index={index} key={index} />
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
