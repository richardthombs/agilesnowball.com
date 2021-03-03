import Link from "next/link";

import Layout from "../components/layout";
import PageMeta from "../components/page-meta";
import FriendlyDate from "../components/date";

import { getAllPosts } from "../lib/api";
import BlogLink from "../components/blog-link";

export default function HomePage({ allPosts }) {

	const posts = allPosts;

	return (
		<Layout>

			<PageMeta
				title="Richard Thombs"
				description="Full stack developer and experienced technologist who thrives on creating new products."
			/>

			<div className="bg-gray-100 px-4 py-8 sm:px-16 sm:py-16">

				<h1 className="text-4xl font-bold tracking-tight mb-4">
					Hi, I'm Richard Thombs
				</h1>
				<div className="text-gray-600 mb-16 leading-relaxed">
					I'm a developer and have been ever since I got my first computer back in 1982 (a BBC model "A").
					I've beaten <a className="font-medium" href="https://grack.com/demos/adventure" rel="nofollow" target="_blank">Colossal Cave</a>,
					dabbled in a bit of MUD and even helped email addresses change from ! to @.
				</div>

				<h1 className="text-3xl font-bold mb-4">Recent posts</h1>

				<ul className="space-y-8">
					{posts.map(post => (
						<li key={post.slug}>
							<BlogLink post={post} />
						</li>
					))}
				</ul>

				<h1 className="text-3xl font-bold mt-12 mb-4">Projects</h1>

				<ul className="grid sm:grid-cols-2 gap-8">
					<li className="border border-gray-200 bg-gray-50 rounded px-8 py-4">
						<a href="https://retailarmy.com" target="_blank">
							<div className="text-lg font-bold">Retail Army</div>
							<div className="text-gray-600">A recruitment portal for field marketing companies.</div>
						</a>
					</li>

					<li className="border border-gray-200 bg-gray-50 rounded px-8 py-4">
						<a href="https://satis.app" target="_blank">
							<div className="text-lg font-bold">Satis</div>
							<div className="text-gray-600">Quick and easy in-store customer satisfaction capture.</div>
						</a>
					</li>

					<li className="border border-gray-200 bg-gray-50 rounded px-8 py-4">
						<a href="https://scunpacked.com" target="_blank">
							<div className="text-lg font-bold">SCunpacked</div>
							<div className="text-gray-600">A Star Citizen data exploration tool.</div>
						</a>
					</li>
				</ul>
			</div>
		</Layout>
	)
}

export async function getStaticProps() {
	const allPosts = getAllPosts()
		.sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
		.slice(0, 3)
		.map(post => { return { title: post.title, date: post.date, slug: post.slug, description: post.description } }); // Strip props to bare minimum
	return { props: { allPosts } };
}
