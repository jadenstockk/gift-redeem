import Head from "next/head"
import Image from "next/image"
import { QrReader } from "react-qr-reader"
import { useState } from "react"
import Link from "next/link"
import Router from "next/router"

export default function Home() {
	const [code, setCode] = useState("")

	return (
		<>
			<Head>
				<title>Jaden&apos;s Gift Code Redeem</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="h-screen flex">
				<div className=" text-white w-fit h-fit block m-auto justify-center p-8 rounded-3xl text-center items-center">
					<div className="items-center">
						<div className="float">
							<h3 className="font-semibold text-2xl">🎁 Jaden&apos;s Gifts</h3>
							<h2 className="font-bold text-4xl mb-5">Redeem Gift Code</h2>
						</div>
						<form onSubmit={() => Router.push("/gifts/" + code)}>
							<h3 className="font-medium">Enter your code below:</h3>
							<input
								className="block w-auto m-auto text-black text-center mt-1"
								type="text"
								id="code"
								name="code"
								onChange={(i) => setCode(i.target.value)}
							/>

							<Link
								className="shine block mt-4 w-48 m-auto bg-green-700 p-2 rounded-xl"
								href={"/gifts/" + code}
							>
								Redeem
							</Link>
						</form>
					</div>
				</div>
			</main>
		</>
	)
}
