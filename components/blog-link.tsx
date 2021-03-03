import Link from "next/link";

import FriendlyDate from "./date";

export default function BlogLink({ post }) {
	return (
		<Link href={`/blog/${post.slug}`}>
			<a>
				<h2 className="text-lg font-medium">
					{post.title}
				</h2>
				<div className="text-gray-600 leading-relaxed">{post.description}</div>
				<div className="hidden text-gray-500 text-sm"><FriendlyDate date={post.date}></FriendlyDate></div>
			</a>
		</Link>
	);
}
