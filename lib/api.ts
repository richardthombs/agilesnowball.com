import { join } from "path";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), '_posts');

export function getPostSlugs() {
	return readdirSync(postsDirectory);
}

export function getAllPosts(): { [key: string]: string }[] {
	const files = readdirSync(postsDirectory);
	const matters = files
		.map(file => getPostByFilename(file))
		.filter(post => !post.hidden);
	return matters;
}

export function getPostByFilename(filename: string): { [key: string]: string } {
	const fullFilename = join(postsDirectory, filename);
	const fileContent = readFileSync(fullFilename, "utf8");
	const { data, content } = matter(fileContent);

	data.slug = (data.title as string).replace(/ /g, "-").replace(/[^a-zA-Z0-9\-]/g, "").toLowerCase();
	data.filename = filename;
	data.content = content;

	return data;
}

export function getPostBySlug(slug: string): { [key: string]: string } {
	const matters = getAllPosts();
	const post = matters.find(x => x.slug == slug);
	return post;
}
