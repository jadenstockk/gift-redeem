import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<body className="bg-slate-800">
				<p className="text-center text-white text-xs m-2">
					Made by <b>Jaden</b> in <b>December 2022</b>
				</p>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
