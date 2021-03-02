import Layout from "../components/layout";
import PageMeta from "../components/page-meta";

export default function About() {
	return (
		<Layout>
			<PageMeta />

			<main className="bg-gray-100 text-gray-800 px-4 py-8 sm:p-16">

				<div className="sm:flex space-y-4 sm:space-y-0 sm:space-x-16">
					<div className="flex-shrink-0 mt-1">
						<img className="rounded w-32 h-auto" src="http://www.gravatar.com/avatar/f413eba6a4985222aeb8328e92ae89c6.png?s=128" alt="Richard's photo" />
					</div>

					<div className="space-y-4 leading-relaxed">
						<p>
							Richard Thombs is a software development professional with 30 years experience
							in application development and infrastructure design.
						</p>

						<p>
							He was the co-founder and Chief Architect at <a className="link" href="https://www.teamhaven.com">TeamHaven</a> and now
							helps companies create web-based products through his consulting company <a className="link" href="https://gearstone.uk">Gearstone Technology</a>.
						</p>
					</div>
				</div>
			</main>
		</Layout>
	);
}
