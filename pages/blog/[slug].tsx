import { getAllPosts, getPostBySlug } from "../../lib/api";
import { markdownToHtml } from "../../lib/markdown";

import "prism-solarized-dark/prism-solarizeddark.css";
import markdownStyles from "./markdown-styles.module.scss";

import Layout from "../../components/layout";
import PageMeta from "../../components/page-meta";
import FriendlyDate from "../../components/date";

export default function Post({ post }) {
	return (
		<Layout>

			<PageMeta
				title={post.title}
				type="article"
				description={post.description}
			/>

			<img className="max-h-96 w-full object-cover" src={post.image || "/AgileSnowball.png"}></img>
			<div className="bg-gray-100 px-4 py-8 sm:p-16 space-y-8 sm:space-y-8">
				<div className="mb-12">
					<h1 className="text-4xl font-semibold tracking-tight leading-tight">{post.title}</h1>
					<div className="text-gray -600 mt-2">By Richard Thombs on <FriendlyDate date={post.date}></FriendlyDate></div>
				</div>
				<div className={markdownStyles.markdown} dangerouslySetInnerHTML={{ __html: post.content }} ></div>
			</div>
		</Layout>
	);
}

export async function getStaticProps({ params }) {
	const post = getPostBySlug(params.slug);
	const content = await markdownToHtml(post.content || "");
	return {
		props: {
			post: {
				...post,
				content
			}
		}
	};
}

export async function getStaticPaths() {
	const posts = getAllPosts();
	return {
		paths: posts.map(post => {
			return {
				params: {
					slug: post.slug
				}
			}
		}),
		fallback: false
	};
}
