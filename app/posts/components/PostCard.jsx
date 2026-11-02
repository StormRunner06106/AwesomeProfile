"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "@/components/Modal";
import Image from "next/image";
import {
  AnimatePresence,
  animate as animateValue,
  motion,
  useMotionValue,
} from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBluesky } from "@fortawesome/free-brands-svg-icons";
import {
  faEye,
  faMinus,
  faPlus,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

const FALLBACK_IMAGE = "/image/post_banner.jpg";
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

function getPostImage(embed) {
  if (!embed) return FALLBACK_IMAGE;

  if (embed.images?.[0]?.fullsize) return embed.images[0].fullsize;
  if (embed.external?.thumb) return embed.external.thumb;
  if (embed.thumbnail) return embed.thumbnail;

  const media = embed.media;
  if (media?.images?.[0]?.fullsize) return media.images[0].fullsize;
  if (media?.external?.thumb) return media.external.thumb;
  if (media?.thumbnail) return media.thumbnail;

  return FALLBACK_IMAGE;
}

function getBlueskyPostUrl(post) {
  const uriParts = post?.uri?.replace("at://", "").split("/");
  const postId = uriParts?.[2];
  const actor = post?.author?.handle || uriParts?.[0];

  if (!actor || !postId) return null;

  return `https://bsky.app/profile/${encodeURIComponent(
    actor
  )}/post/${encodeURIComponent(postId)}`;
}

export default function PostCard({ post, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const imageViewportRef = useRef(null);
  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);
  const postData = post?.post;
  const description = postData?.record?.text?.trim() || "";
  const imageSrc = getPostImage(postData?.embed);
  const blueskyPostUrl = getBlueskyPostUrl(postData);
  const authorName = postData?.author?.displayName || postData?.author?.handle;
  const imageAlt = authorName
    ? `Post by ${authorName}`
    : `Post thumbnail ${index + 1}`;
  const dragOverflow = {
    x: (viewportSize.width * (zoom - MIN_ZOOM)) / 2,
    y: (viewportSize.height * (zoom - MIN_ZOOM)) / 2,
  };

  const resetImagePosition = () => {
    animateValue(imageX, 0, { duration: 0.2, ease: "easeOut" });
    animateValue(imageY, 0, { duration: 0.2, ease: "easeOut" });
  };

  const closeDialog = () => {
    setIsOpen(false);
    setZoom(MIN_ZOOM);
    resetImagePosition();
  };

  const adjustZoom = (amount) => {
    resetImagePosition();
    setZoom((currentZoom) =>
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom + amount))
    );
  };

  useEffect(() => {
    if (!isOpen || !imageViewportRef.current) return undefined;

    const viewport = imageViewportRef.current;
    const measureViewport = () => {
      setViewportSize({
        width: viewport.clientWidth,
        height: viewport.clientHeight,
      });
    };
    const resizeObserver = new ResizeObserver(measureViewport);

    measureViewport();
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-inverse text-left shadow-md transition-shadow duration-300 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-700"
        aria-label={`View post${authorName ? ` by ${authorName}` : ""}`}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        {description && (
          <div className="group/caption absolute inset-x-0 bottom-0 flex min-h-16 items-center bg-black/60 px-4 py-3 text-white backdrop-blur-[2px] transition-colors duration-300 hover:bg-black/70">
            <p
              className="w-full text-sm leading-5 transition-all duration-300 group-hover/caption:-translate-y-1 group-hover/caption:opacity-0"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {description}
            </p>
            <FontAwesomeIcon
              icon={faEye}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-75 text-lg opacity-0 transition-all duration-300 group-hover/caption:scale-100 group-hover/caption:opacity-100"
              aria-hidden="true"
            />
          </div>
        )}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={closeDialog}
        titleId={description ? `post-dialog-title-${index}` : undefined}
        label={description ? undefined : "Post image"}
        closeLabel="Close post"
        className={description ? "max-w-6xl" : "max-w-5xl"}>
        <div
          ref={imageViewportRef}
          className={`relative h-[55vh] shrink-0 overflow-hidden bg-inverse md:h-full ${
            description ? "md:w-3/5" : "md:w-full"
          }`}
        >
          <motion.div
            className={`absolute inset-0 touch-none ${
              zoom > MIN_ZOOM
                ? "cursor-grab active:cursor-grabbing"
                : "cursor-default"
            }`}
            style={{ x: imageX, y: imageY }}
            animate={{ scale: zoom }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            drag={zoom > MIN_ZOOM}
            dragConstraints={{
              left: -dragOverflow.x,
              right: dragOverflow.x,
              top: -dragOverflow.y,
              bottom: dragOverflow.y,
            }}
            dragElastic={0.06}
            dragMomentum={false}
            onDoubleClick={() => {
              resetImagePosition();
              setZoom((currentZoom) =>
                currentZoom === MIN_ZOOM ? 2 : MIN_ZOOM
              );
            }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="select-none object-contain"
              sizes={
                description
                  ? "(max-width: 768px) 94vw, 60vw"
                  : "(max-width: 768px) 94vw, 80vw"
              }
              priority
              draggable={false}
            />
          </motion.div>

          <AnimatePresence>
            {zoom > MIN_ZOOM && (
              <motion.div
                className="pointer-events-none absolute left-4 top-4 z-20 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                Drag to move
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/70 p-1.5 text-white shadow-lg backdrop-blur-sm">
            <button
              type="button"
              aria-label="Zoom out"
              title="Zoom out"
              disabled={zoom <= MIN_ZOOM}
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/20 disabled:opacity-35"
              onClick={() => adjustZoom(-ZOOM_STEP)}
            >
              <FontAwesomeIcon icon={faMinus} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Reset zoom"
              title="Reset zoom"
              disabled={zoom === MIN_ZOOM}
              className="flex h-9 min-w-16 items-center justify-center gap-2 rounded-full px-2 text-xs transition hover:bg-white/20 disabled:opacity-60"
              onClick={() => {
                setZoom(MIN_ZOOM);
                resetImagePosition();
              }}
            >
              <FontAwesomeIcon
                icon={faRotateLeft}
                aria-hidden="true"
              />
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              title="Zoom in"
              disabled={zoom >= MAX_ZOOM}
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/20 disabled:opacity-35"
              onClick={() => adjustZoom(ZOOM_STEP)}
            >
              <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
            </button>
          </div>
        </div>

        {description && (
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-20 pt-16 md:w-2/5 md:px-10 md:pb-20 md:pt-16">
            <h2
              id={`post-dialog-title-${index}`}
              className="mb-5 text-2xl font-semibold text-ink"
            >
              Post details
            </h2>
            <p className="whitespace-pre-wrap break-words text-base leading-8 text-copy">
              {description}
            </p>
          </div>
        )}

        {blueskyPostUrl && (
          <a
            href={blueskyPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open this post on Bluesky"
            title="Open on Bluesky"
            className="absolute bottom-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-xl text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          >
            <FontAwesomeIcon icon={faBluesky} aria-hidden="true" />
          </a>
        )}
      </Modal>
    </>
  );
}
