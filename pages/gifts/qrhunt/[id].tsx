import Head from "next/head"
import type { NextPageContext } from "next"
import Image from "next/image"
import { QrReader } from "react-qr-reader"
import { useState } from "react"

interface PropsInterface {
	error?: string
	data?: any
}

export default function QRHunt({ data, error }: PropsInterface) {
	const [qrData, setQRData] = useState("No result")
	const [progress, setProgress] = useState(0)
	const [clue, setClue] = useState(null)
	const [textError, setTextError] = useState(error)
	const [extraClue, setExtraClue] = useState(null)

	const clueProgressUpdate = (result?: string) => {
		const clues = data.qrhunt.clues
		if (!clues) return console.error("No clues found")
		if (result && data) {
			if (result === `${progress + 1}_${data._id}`) {
				setProgress(progress + 1)
				setClue(clues[progress])
				setExtraClue(null)
			} else {
				setTextError(
					"That is not the correct QR code. Remember to scan the QR codes in order."
				)
			}
		} else {
			setClue(clues[progress])
		}
	}

	return (
		<>
			<Head>
				<title>Jaden&apos;s QR Code Hunt Gift Redeem</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				{textError ? (
					<div className="bg-red-600 w-fit mx-auto my-5 rounded-3xl px-5 py-1 text-center">
						<p className="text-stone-100 font-semibold">{textError}</p>
					</div>
				) : null}
				{data ? (
					<div className="text-white max-w-sm flex m-auto mt-10 justify-center rounded-3xl flex-col text-center">
						{clue ? (
							<>
								<h2 className="font-bold text-xl mb-16">
									🎁 Welcome to the QR Code Hunt!
								</h2>
								<div className="text-white max-w-sm m-auto">
									<div className="float">
										<h2 className="font-bold text-xl">
											🤔 Clue Number {progress + 1}:
										</h2>
										<p className=" mt-1">
											{clue["description"] ||
												"There was a problem loading the clue"}
										</p>
									</div>
									<button
										id="extraClue"
										className="text-white font-medium text-sm bg-orange-700 rounded-3xl px-5 py-1 mt-5 mb-10"
										onClick={() => {
											setExtraClue(clue["extra"])
										}}
									>
										{extraClue
											? "Extra Clue: " + extraClue
											: "Click here for another clue"}
									</button>
								</div>
								<div className="text-center">
									<p>
										When you find a QR Code, position it in view of the camera
										below and it will automatically scan it and tell you the
										next clue
									</p>
									<QrReader
										constraints={{ facingMode: "front" }}
										onResult={(result, error) => {
											if (result) {
												clueProgressUpdate(result.getText())
												setQRData(result.getText())
											}
											if (error) {
												return
											}
										}}
										className="w-full m-0"
									/>
								</div>
							</>
						) : (
							<>
								<div className="max-w-sm m-auto mt-16">
									<h2 className="float font-bold text-xl">
										🎁 Welcome to the QR Code Hunt!
									</h2>
									<p className="mt-5">
										The QR Code Hunt is a scavenger hunt where the aim is is to
										collect clues in order to find your gift! The clues are in
										the form of QR codes which are hidden in secret locations.
										You can scan the QR codes to get the clues. The clues will
										lead you to the gift. You must scan the QR codes in order.
										Good luck! Click the button below to start.
									</p>
									<button
										className="shine text-white font-medium text-l bg-green-600 rounded-3xl px-5 py-2 mt-5"
										onClick={() => clueProgressUpdate()}
									>
										Start the Hunt
									</button>
								</div>
							</>
						)}
					</div>
				) : (
					<div className="text-white text-center m-20 font-semibold text-xl">
						<h2 className="font-bold text-3xl mb-2">
							👋 You have reached the QR Hunt page
						</h2>
						<p>
							Unfortunately you are not allowed to use this page without a valid
							gift id
						</p>
					</div>
				)}
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
	} else if (data && data.type !== "qrhunt" && !data.qrhunt) {
		return {
			props: {
				error:
					"Sorry! The id that was entered is valid but isn't meant to be used for this purposes"
			}
		}
	}

	return {
		props: {
			data
		}
	}
}
