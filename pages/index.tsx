import Link from "next/link";
import Layout from "../components/layout";
import FriendlyDate from "../components/date";

import { getAllPosts } from "../lib/api";

export default function HomePage({ allPosts }) {

	const posts = allPosts;

	return (
		<Layout>
			<ul className="bg-gray-100 px-4 sm:px-16 sm:py-8 space-y-4 sm:space-y-8">
				{posts.map(post => (
					<li key={post.slug}>
						<Link href={`/posts/${post.slug}`}>
							<a>
								<h2 className="text-lg">
									{post.title}
								</h2>
							</a>
						</Link>
						<div className="text-gray-500 text-sm"><FriendlyDate date={post.date}></FriendlyDate></div>
					</li>
				))}
			</ul>
		</Layout>
	)
}

export async function getStaticProps() {
	const allPosts = getAllPosts();
	return { props: { allPosts } };
}
