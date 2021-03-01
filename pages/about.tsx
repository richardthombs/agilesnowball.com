import Layout from "../components/layout";

export default function About() {
	return (
		<Layout>
			<main className="bg-gray-100 text-gray-800 px-4 py-8 sm:p-16">

				<div className="sm:flex space-y-4 sm:space-y-0 sm:space-x-16">
					<img className="rounded w-32" src="http://www.gravatar.com/avatar/f413eba6a4985222aeb8328e92ae89c6.png?s=128" alt="Richard's photo" />

					<div className="space-y-4">
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
