import Head from "next/head"
import type { NextPageContext } from "next"
import Image from "next/image"
import QRCode from "react-qr-code"
import { useState } from "react"

interface PropsInterface {
	error?: string
	data?: any
	url: string
}

export default function QRHunt({ data, url }: PropsInterface) {
	return (
		<>
			<Head>
				<title>Jaden&apos;s QR Code Generator</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				{data && data.qrhunt ? (
					<div className="text-white text-center mt-10">
						<h2 className="font-bold text-3xl mb-10">
							QR Codes
							{data.recipient?.fullName
								? " for " + data.recipient?.fullName
								: ""}
							:
						</h2>
						<div className="py-10 bg-white text-black">
							<QRCode
								className="m-auto"
								value={process.env.URL + "/gifts/" + data.code}
								format="jpg"
							/>

							<p>{url + "/gifts/" + data.code}</p>
						</div>
						<p className="py-10 bg-white text-black">
							Remember to ignore the first 0 because it is already included in
							the initial code
						</p>
						{data.qrhunt.clues
							? data.qrhunt.clues.map((clue: any, index: number) => (
									<>
										<div className="py-10 bg-white text-black">
											<QRCode
												className="m-auto"
												value={`${index}_${data._id}`}
											/>
											<p
												className={index === 0 ? "text-red-500" : ""}
											>{`${index}_${data._id}`}</p>
											<p>{clue.description}</p>
											<p>{clue.extra}</p>
										</div>
									</>
							  ))
							: null}
					</div>
				) : null}
			</main>
		</>
	)
}

export async function getServerSideProps(context: NextPageContext) {
	const { id } = context.query

	let { data, error, type, redeemed } = await (
		await fetch(process.env.URL + "/api/gifts/" + id, {
			method: "POST"
		})
	).json()

	if (data) data = JSON.parse(data)

	if (error || !data || !type || type !== "id") {
		return {
			props: { error: error || "Sorry! The id that was entered isn't valid" }
		}
	}

	return {
		props: {
			data,
			url: process.env.URL
		}
	}
}
