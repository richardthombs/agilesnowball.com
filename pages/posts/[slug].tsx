import { getAllPosts, getPostBySlug } from "../../lib/api";
import { markdownToHtml } from "../../lib/markdown";

import markdownStyles from "./markdown-styles.module.scss";
import "prism-solarized-dark/prism-solarizeddark.css";

import Layout from "../../components/layout";
import FriendlyDate from "../../components/date";

export default function Post({ post }) {
	return (
		<Layout>
			<div className="bg-gray-100 text-gray-800 p-4 sm:px-16 sm:py-8">
				<div className="mb-4">
					<h1 className="text-3xl leading-normal">{post.title}</h1>
					<div className="text-gray-600 mt-2"><FriendlyDate date={post.date}></FriendlyDate></div>
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
