import Header from "../components/header";
import Footer from "../components/footer";

export default function Layout({ children }) {
	return (
		<div className="min-h-screen bg-gray-900 text-gray-800 sm:p-16">
			<div className="sm:max-w-4xl sm:mx-auto sm:rounded-lg sm:overflow-hidden">
				<Header></Header>
				<main className="text-gray-800">{children}</main>
				<Footer></Footer>
			</div>
		</div>
	);
}
