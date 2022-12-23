import "../styles/globals.scss"
import type { AppProps } from "next/app"
import mongoose from "mongoose"

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />
}
