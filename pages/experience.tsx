export default function CV() {
	return (
		<div className="bg-gray-900 min-h-screen sm:p-16 font-inter">
			<div className="sm:max-w-6xl sm:mx-auto sm:flex sm:rounded-lg sm:overflow-hidden">

				<div className="w-full bg-gray-100 text-gray-800 h-full p-8 sm:p-16 space-y-8">

					<header className="flex-grow">
						<h1 className="text-4xl">Richard Thombs</h1>
						<h2 className="text-lg text-gray-500">Chief Architect</h2>
					</header>

					<main>
						<section>
						</section>

						<section>
							<h2 className="text-lg text-gray-600 border-b border-gray-300 mb-2">Technical expert</h2>

							<div className="break-avoid">
								I've been using C#, .NET and ASP.NET since version 1 in 2003.
								When I was starting TeamHaven I had a chance to pick the technologies I wanted to work with and C# was the obvious choice.

								I've been using AngularJS since it was released in 2011.
								After an unsuccessful flirtation with knockout.js I switched TeamHaven's frontend to AngularJS along with an ASP.NET Web API.

								I've been using TypeScript for about 3 years
								I switched TeamHaven from JavaScript to TypeScript using a custom Webpack build process.

								I've been using Node for as long as npm packages have been about
								I've not written anything particularly complicated in pure node.js, my familiarity with it comes from a tinkering tool-user's perspective.

								I've been using Windows Azure for about 8 years.
								Once Microsoft released their SSD based premium storage we migrated our 1Tb database across as soon as we could.
							</div>
						</section>

						<section>
							<h2 className="text-lg text-gray-600 border-b border-gray-300 mb-2">Designer</h2>
							<div className="break-avoid space-y-4">
								<p>
									I've designed solutions my entire career. While you might think that I lack experience at "enterprise-level",
									I am confident that I more than make up for that with the depth and duration of my experience.
								</p>
								<p>
									At TeamHaven, I
									had nearly 15 years of designing systems and seeing how those designed worked out. Living with the successes, mistakes and growing
									pains of every decision. TeamHaven was built in a time before SOA, microservices and events, but it was restructured repeatedly
									as software engineering matured and it now uses all of these technologies because I evaluated them, designed implementations and
									then did the actual implementation.
								</p>
								<p>
									At Mosaic I was responsible for every technological decision in the company, from software architecture to IT systems. We built
									systems that operated at a fraction of the manpower and hardware cost of our sister companies and yet were more than equal when
									it came to winning business.
								</p>

							</div>
						</section>

						<section>
							<h2 className="text-lg text-gray-600 border-b border-gray-300 mb-2">Innovator</h2>
							<div className="break-avoid space-y-4">
							</div>
						</section>

						<section>
							<h2 className="text-lg text-gray-600 border-b border-gray-300 mb-2">Communicator</h2>

							<div className="break-avoid space-y-4">
								<p>
									While at TeamHaven I have regularly dealt with our customers. Typically this would involve a negotiation around their requirements and our vision with
									the end goal of making sure that we met their needs while producing features that would meet multiple customers' needs and still keeping TeamHaven heading in the direction we wanted.
								</p>
								<p>
									Prior to TeamHaven, I was on the senior leadership team at both Mosaic and EMS and before that I was part of the IT steering group at Lucas Industries.
								</p>
							</div>
						</section>
					</main>

				</div>
			</div>
		</div>

	);
}
