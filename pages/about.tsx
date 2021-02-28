import Layout from "../components/layout";

export default function About() {
	return (
		<Layout>
			<main className="bg-gray-100 text-gray-800 p-4 sm:p-16">
				<h1 className="hidden text-3xl leading-normal mb-4">About the author</h1>

				<div className="flex space-x-8">
					<div>
						<img className="rounded" src="http://www.gravatar.com/avatar/f413eba6a4985222aeb8328e92ae89c6.png?s=256" alt="" />
					</div>

					<div className="space-y-4">
						<p>
							Richard Thombs is a software development professional with 30 years experience
							in application development and infrastructure design.
						</p>

						<p>
							He was the co-founder and Chief Architect at <a className="link" href="https://www.teamhaven.com">TeamHaven</a> and now
							provides product development services through his consultancy company <a className="link" href="https://gearstone.uk">Gearstone Technology</a>.
						</p>
					</div>
				</div>
			</main>
		</Layout>
	);
}
