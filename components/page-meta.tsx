import Head from "next/head";
import { useRouter } from "next/router";

export default function PageMeta(props) {

	const { children, ...customMeta } = props;
	const router = useRouter();

	const meta = {
		site: "Agile Snowball",
		title: "Richard Thombs",
		canonical: `https://agilesnowball.com${router.asPath}`,
		description: "",
		image: "https://agilesnowball.com/AgileSnowball.png",
		type: "website",
		...customMeta
	};

	return (
		<Head>
			<title>{meta.title}</title>

			<link rel="icon" type="image/png" href="/favicon.png" />
			<link rel="canonical" href={meta.canonical} />

			{meta.description && <meta name="description" content={meta.description} />}

			<meta property="og:site_name" content={meta.site} />
			<meta property="og:url" content={meta.canonical} />
			<meta property="og:title" content={meta.title} />
			{meta.description && <meta property="og:description" content={meta.description} />}
			<meta property="og:image" content={meta.image} />
			<meta property="og:type" content={meta.type} />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@stonyuk" />
			<meta name="twitter:title" content={meta.title} />
			<meta name="twitter:description" content={meta.description} />
			<meta name="twitter:image" content={meta.image} />
			{meta.date && <meta property="article:published_time" content={meta.date} />}
		</Head>

	);
}
