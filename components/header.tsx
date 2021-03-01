import Link from "next/link";

export default function Header() {
	return (
		<header className="px-4 py-8 sm:px-16 bg-gray-50 text-gray-800 flex space-x-4 sm:space-x-8 items-center border-b border-gray-200 shadow">

			<h1 className="text-2xl sm:text-4xl font-bold tracking-tight w-full">
				<Link href="/">
					<a>Agile Snowball</a>
				</Link>
			</h1>

			<Link href="/">
				<a>Home</a>
			</Link>

			<Link href="/blog">
				<a>Blog</a>
			</Link>

			<Link href="/about">
				<a>About</a>
			</Link>
		</header>
	);
}
