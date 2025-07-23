import Image from "next/image";

export default function PostCard({ post, index }) {
  console.log(index);

  return (
    <div className="flex flex-col w-64 h-80 bg-white rounded-xl shadow-md overflow-hidden m-2">
      {/* Thumbnail image */}
      <div className="relative w-full h-40 bg-gray-200">
        <Image
          src={
            Object.keys(post.post).includes("embed")
              ? Object.keys(post.post.embed).includes("images") &&
                post.post.embed.images.length > 0
                ? post.post.embed.images[0].fullsize
                : "/image/post_banner.jpg"
              : "/image/post_banner.jpg"
          }
          alt={"Post thumbnail" + index}
          fill
          style={{ objectFit: "cover" }}
          sizes="256px"
        />
      </div>
      {/* Text content */}
      <div className="flex flex-col flex-1 p-4">
        <p
          className="text-gray-600 text-sm overflow-hidden text-ellipsis"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
          }}
          title={post.post.record.text}
        >
          {post.post.record.text}
        </p>
      </div>
    </div>
  );
}
