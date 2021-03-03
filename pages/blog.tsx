import Link from "next/link";

import Layout from "../components/layout";
import PageMeta from "../components/page-meta";
import FriendlyDate from "../components/date";
import BlogLink from "../components/blog-link";

import { getAllPosts } from "../lib/api";

export default function Blog({ allPosts }) {

	const posts = allPosts;

	return (
		<Layout>

			<PageMeta
				title="Agile Snowball by Richard Thombs"
				description="Lessons learned and challenges faced while keeping an ASP.NET and SQL Server web application agile enough to take advantage of the latest tools, technologies and methodologies."
			/>

			<div className="bg-gray-100 px-4 py-8 sm:px-16 sm:py-16">
				<h1 className="text-3xl font-bold mb-4">All posts</h1>
				<ul className="space-y-8 sm:space-y-8">
					{posts.map(post => (
						<li key={post.slug}>
							<BlogLink post={post} />
						</li>
					))}
				</ul>
			</div>
		</Layout>
	)
}

export async function getStaticProps() {
	const allPosts = getAllPosts()
		.sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
		.map(post => { return { title: post.title, date: post.date, slug: post.slug, description: post.description } }); // Strip props to bare minimum
	return { props: { allPosts } };
}
