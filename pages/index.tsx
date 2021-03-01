import Link from "next/link";
import Head from "next/head";

import Layout from "../components/layout";
import FriendlyDate from "../components/date";

import { getAllPosts } from "../lib/api";

export default function HomePage({ allPosts }) {

	const posts = allPosts;

	return (
		<Layout>
			<Head>
				<title>Agile Snowball</title>
				<link rel="icon" type="image/png" href="/favicon.png" />
			</Head>
			<ul className="bg-gray-100 px-4 py-8 sm:px-16 space-y-8 sm:space-y-8">
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
	const allPosts = getAllPosts()
		.sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
		.map(post => { return { title: post.title, date: post.date, slug: post.slug } }); // Strip props to bare minimum
	return { props: { allPosts } };
}
