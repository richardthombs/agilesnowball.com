import { join } from "path";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), '_posts')

export function getPostSlugs() {
	return readdirSync(postsDirectory);
}

export function getPostBySlug(slug): any {
	const realSlug = slug.replace(/\.md$/, '');
	const fullPath = join(postsDirectory, `${realSlug}.md`);
	const fileContents = readFileSync(fullPath, 'utf8');
	const { data, content } = matter(fileContents);

	return {
		slug: realSlug,
		title: data.title,
		date: data.date,
		hidden: data.hidden || false,
		content: content
	};
}

export function getAllPosts() {
	const slugs = getPostSlugs()
	const posts = slugs
		.map(slug => getPostBySlug(slug))
		.filter(x => x.hidden !== true)
		.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));// sort posts by date in descending order
	return posts;
}
