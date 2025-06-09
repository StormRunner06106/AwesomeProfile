import Image from "next/image";

export default function PostCard({ post, index }) {
	return (
		<>
            <div className="flex items-center p-4 max-w-md mx-auto bg-white rounded-xl overflow-hidden w-full">
                {/* Image on the left */}
                <div className="flex-shrink-0">
                    <Image
                        className="h-12 w-12 rounded-full"
                        src={post.image_url} // or from public folder
                        alt="Description of image"
                        width={48}
                        height={48}
                    />
                </div>
                
                {/* Text content on the right */}
                <div className="ml-4">
                    {/* Title row */}
                    <h3 className="text-xl font-medium text-black">{post.title}</h3>
                    {/* Subtitle row */}
                    <p className="text-gray-500">{post.description}</p>
                </div>
            </div>
        </>
    )
}