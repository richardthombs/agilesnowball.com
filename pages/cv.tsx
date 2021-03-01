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
						<h2 className="text-lg text-gray-500 border-b border-gray-300 mb-2">Personal statement</h2>
						<div className="prose">
							An experienced technologist who thrives on creating new products. I am looking for a senior role at a start-up or small business,
							preferably somewhere with a fast-moving entrepreneurial mindset.
						</div>
					</main>

					<section>
						<h2 className="text-lg text-gray-600 border-b border-gray-300 mb-2">Experience</h2>
						<div className="ml-2 mt-4">

							<div className="relative">
								<div className="absolute h-full bg-gray-300 -ml-px w-0.5"></div>
								<div className="absolute -left-3 top-0 h-6 w-6 bg-gray-300 rounded-full ring-2 ring-gray-100"></div>
								<article className="ml-8 pt-0 break-avoid">
									<h3 className="font-semibold">Founder</h3>
									<h4 className="text-gray-500 text-sm">Gearstone Technology</h4>
									<div className="prose mt-2">
										<div className="prose">
											Started a company specialising in helping companies to develop web-based products:
											<ul className="list-disc list-outside ml-5 mt-2">
												<li>A recruitment platform focused on the needs of the merchandising and field marketing industries.</li>
												<li>An app for capturing customer satisfaction.</li>
												<li>A dashboard designer and reporting system.</li>
											</ul>
										</div>
									</div>
								</article>
							</div>

							<div className="relative">
								<div className="absolute h-full bg-gray-300 -ml-px w-0.5"></div>
								<div className="absolute -left-3 top-8 h-6 w-6 bg-gray-300 rounded-full ring-2 ring-gray-100"></div>
								<article className="ml-8 pt-8 break-avoid">
									<h3 className="font-semibold">Founder &amp; Chief Architect</h3>
									<h4 className="text-gray-500 text-sm">TeamHaven</h4>
									<div className="prose mt-2">
										Co-founded a field management &amp; data-collection company, pioneering phone and tablet-based data collection for field workers.
										This involved everything from concept design to building the product, as well as collaborating on marketing and sales. Over nearly 15 years,
										I kept the product fresh by adopting new technology along the way, improving the maintainability of the code and implementing build, test,
										deployment and monitoring tools as well.
									</div>
								</article>
							</div>

							<div className="relative">
								<div className="absolute h-full bg-gray-300 -ml-px w-0.5"></div>
								<div className="absolute -left-3 top-8 h-6 w-6 bg-gray-300 rounded-full ring-2 ring-gray-100"></div>
								<article className="ml-8 pt-8 break-avoid">
									<h3 className="font-semibold">Director of Information Solutions</h3>
									<h4 className="text-gray-500 text-sm">Mosaic Retail Solutions</h4>
									<div className="prose mt-2">
										I relocated to California to work with Mosaic Retail Solutions. They needed strategic technical direction and a solid application infrastructure which I was able to deliver.
										In my two and a half years with them, our data collection and information reporting systems became one of the best in the industry, with many client wins coming as a direct
										result of their capabilities.
									</div>
								</article>
							</div>

							<div className="relative">
								<div className="absolute h-full bg-gray-300 -ml-px w-0.5"></div>
								<div className="absolute -left-3 top-8 h-6 w-6 bg-gray-300 rounded-full ring-2 ring-gray-100"></div>
								<article className="ml-8 pt-8 break-avoid">
									<h3 className="font-semibold">Technical Director</h3>
									<h4 className="text-gray-500 text-sm">Europa Merchant Services</h4>
									<div className="prose mt-2">
										I was responsible for the development of an information systems team to provide systems administration as well as internal and customer-facing software development services.
										As EMS was small, it was possible to be deeply involved in all aspects of running the company and I gained a good deal of commercial experience.
										During this time I ran three very crucial parts of the operation – merchandiser support, client reporting and information systems.
									</div>
								</article>
							</div>

						</div>
					</section>

					<section>
						<h2 className="text-lg text-gray-600 border-b border-gray-300 mb-2">Summary</h2>
						<div className="prose">
							I am an articulate information technologist, specialising in product-focused development.
							I have founded my own company and have also worked for companies ranging from small businesses to multi-nationals.
							This has given me a wide range of professional and commercial experience.
						</div>
					</section>

				</div>

				<footer className="bg-gray-600 text-gray-200 px-8 py-8 space-y-8">
					<section>
						<h2 className="text-lg text-gray-400 font-light">Contact</h2>
						<a className="block font-light" href="mailto:richard@gearstone.uk">richard@gearstone.uk</a>
						<a className="block font-light" href="tel:07897363186">07897 363186</a>
					</section>

					<section className="space-y-4">
						<h2 className="sr-only">Skills</h2>
						<div className="">
							<h3 className="text-lg text-gray-400 font-light mb-2">Languages</h3>
							<div className="text-sm">
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">C#</span>
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">Typescript</span>
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">Javascript</span>
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">SQL</span>
							</div>
						</div>

						<div className="">
							<h3 className="text-lg text-gray-400 font-light mb-2">Frameworks</h3>
							<div className="text-sm">
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">.NET</span>
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">ASP.NET</span>
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">Entity Framework</span>
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">Angular</span>
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">Tailwind</span>
							</div>
						</div>

						<div className="">
							<h3 className="text-lg text-gray-400 font-light mb-2">Platforms</h3>
							<div className="text-sm">
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">Azure</span>
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">Docker</span>
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">Kubernetes</span>
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">GitHub</span>
								<span className="inline-block bg-gray-200 text-gray-800 rounded text-center mr-2 mb-2 px-2 py-1">SQL Server</span>
							</div>
						</div>
					</section>
				</footer>
			</div>
		</div>

	);
}
