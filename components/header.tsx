import Link from "next/link";

export default function Header() {
	return (
		<header className="bg-gray-50 text-gray-800 flex items-center border-b border-gray-200 shadow">
			<Link href="/">
				<a className="flex items-center flex-shrink-0">
					<img className="h-16 w-16 sm:h-20 sm:w-20 mr-4 sm:mr-8" src="/favicon.png" />
					<h1 className="text-2xl sm:text-4xl">Agile Snowball</h1>
				</a>
			</Link>

			<Link href="/about">
				<a className="w-full text-right mr-4 sm:mr-16">About</a>
			</Link>
		</header>
	);
}
