import Head from "next/head"
import type { NextPageContext } from "next"
import Image from "next/image"
import { QrReader } from "react-qr-reader"
import { useEffect, useState } from "react"
import Confetti from "react-confetti"
import spacetime from "spacetime"

interface PropsInterface {
	error?: string
	data?: any
	url?: string
}

export default function QRHunt({ data, error, url }: PropsInterface) {
	let [displayError, setDisplayError] = useState(error)
	let [clue, setClue] = useState({
		description: null,
		extra: null,
		final: false
	})
	let [progress, setProgress] = useState(0)
	let [extraClue, setExtraClue] = useState("")
	let [showConfetti, setShowConfetti] = useState(false)
	let [startDate, setStartDate] = useState(new Date())
	let [endDate, setEndDate] = useState(new Date())
	let [completed, setCompleted] = useState(false)

	let previousScan = ""
	let errorTimeout: any

	const updateClue = (result: any, err: any) => {
		if (!result || err || !data || !result.getText()) return

		const qrCodeText = result.getText()
		const nextProgress = progress + 1

		if (qrCodeText === `${nextProgress}_${data._id}`) {
			const clues = data.qrhunt.clues
			if (!clues) return console.log("Clues not found")

			setShowConfetti(true)
			setTimeout(() => {
				setShowConfetti(false)
			}, 5000)
			setProgress((currentProgress) => currentProgress + 1)
			progress = nextProgress
			setClue(clues[nextProgress])
			setExtraClue("")
			setDisplayError("")
			console.log("Updated clue")
		} else {
			if (qrCodeText === previousScan) return
			if (errorTimeout) clearTimeout(errorTimeout)
			let qrError =
				"That's the wrong QR code. Make sure you scan them in order..."
			if (qrError !== displayError) setDisplayError(qrError)
			errorTimeout = setTimeout(() => {
				setDisplayError("")
			}, 5000)
			console.log("Wrong QR code")
		}

		if (qrCodeText !== previousScan) previousScan = qrCodeText
	}

	const initialClue = () => {
		if (!data || !data.qrhunt || !data.qrhunt.clues) return

		const clues = data.qrhunt.clues
		if (!clues) return console.log("Clues not found")

		setClue(clues[progress])
		console.log("Set initial clue")

		setStartDate(new Date())
		startDate = new Date()
		console.log("Start date set")
	}

	const showExtraClue = () => {
		if (!data || !data.qrhunt) return

		const clues = data.qrhunt.clues
		if (!clues) return console.log("Clues not found")

		if (clue && clue["extra"]) {
			setExtraClue(clue["extra"])
		} else {
			setExtraClue("There's no extra clue")
		}
	}

	const completedGame = () => {
		if (!data || !data.qrhunt) return

		const clues = data.qrhunt.clues
		if (!clues) return console.log("Clues not found")

		setShowConfetti(true)
		setTimeout(() => {
			setShowConfetti(false)
		}, 5000)

		setEndDate(new Date())
		endDate = new Date()
		setCompleted(true)
	}

	return (
		<>
			<Head>
				<title>Jaden&apos;s QR Code Hunt Gift Redeem</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				{showConfetti ? (
					<Confetti
						className="w-screen h-screen overflow-hidden"
						width={800}
						height={800}
						recycle={false}
					/>
				) : null}
				{displayError ? (
					<div className="bg-red-600 w-fit mx-auto my-5 rounded-3xl px-5 py-1 text-center">
						<p className="text-stone-100 font-semibold">{displayError}</p>
					</div>
				) : null}
				{data ? (
					<div className="text-white max-w-sm flex m-auto mt-10 justify-center rounded-3xl flex-col text-center">
						{!completed ? (
							<>
								{clue && clue["description"] ? (
									<>
										<h2 className="font-bold text-3xl mb-16">
											🎁 Jaden&apos;s QR Code Hunt
										</h2>
										<div className="text-white max-w-sm m-auto">
											<div className="float">
												<h2 id="clue-heading" className="font-bold text-xl">
													{clue.final
														? "🤗 The Final Clue!"
														: "🤔 Clue Number " +
														  (progress + 1) +
														  " of " +
														  data?.qrhunt?.clues?.length}
												</h2>
												<p id="clue-description" className=" mt-1">
													{clue?.description ||
														"There was a problem loading the clue"}
												</p>
											</div>
											<button
												id="clue-extra"
												className="text-white font-medium text-sm bg-orange-700 rounded-3xl px-5 py-1 mt-5 mb-10"
												onClick={() => showExtraClue()}
											>
												{extraClue.length > 0
													? "Extra Clue: " + extraClue
													: "Click here for an extra clue"}
											</button>
										</div>
										{clue.final ? (
											<div className="text-center">
												<button
													id="extraClue"
													className="text-white font-medium text-sm bg-green-900 rounded-3xl px-8 py-3 mt-5 mb-10"
													onClick={() => completedGame()}
												>
													🎉 Click here once you have found the gift
												</button>
											</div>
										) : (
											<div className="text-center">
												<p className="mb-5">
													When you find a QR Code, position it in view of the
													camera below and the next clue will appear on screen
													with some confetti to congratulate you!
												</p>
												<QrReader
													constraints={{ facingMode: "environment" }}
													onResult={(result, err) =>
														result ? updateClue(result, err) : null
													}
													scanDelay={1000}
													className="w-full m-0"
												/>
											</div>
										)}
									</>
								) : (
									<>
										<div className="max-w-sm m-auto mt-16">
											<h2 className="float font-bold text-3xl flex flex-col">
												<span className="text-xl">Welcome to</span>🎁
												Jaden&apos;s QR Code Hunt!
											</h2>
											<p className="mt-5">
												The QR Code Hunt is a scavenger hunt where the aim is is
												to collect clues in order to find your gift! The clues
												are in the form of QR codes which are hidden in secret
												locations. You can scan the QR codes to get the clues.
												The clues will lead you to the gift. You must scan the
												QR codes in order. Good luck! Click the button below to
												start.
											</p>
											<button
												className="shine text-white font-medium text-l bg-green-600 rounded-3xl px-5 py-2 mt-5"
												onClick={() => initialClue()}
											>
												Start the Hunt
											</button>
										</div>
									</>
								)}
							</>
						) : (
							<>
								<h2 className="font-bold text-3xl mb-16">
									🎁 Jaden&apos;s QR Code Hunt
								</h2>
								<div className="text-white max-w-sm m-auto">
									<div className="float">
										<h2 className="font-bold text-xl">
											🎉 Congratulations {data?.recipient?.fullName || ""}!
										</h2>
										<p className="mt-1">
											You have successfully completed the QR Code Hunt and found
											your gift! If you would like to look back on this
											experience in the future you can scan the first QR code
											again or copy and save the following link:
										</p>
										<a
											className="mx-auto my-5 text-xs text-blue-300 overflow-ellipsis"
											href={`${url}/gifts/${data?._id || "unknown"}`}
											target="_blank"
											rel="noreferrer"
										>{`${url}/gifts/${data?._id || "unknown"}`}</a>
										<p className="my-10">
											Time Taken to Complete:{" "}
											{spacetime(startDate).diff(endDate).minutes} minutes
										</p>
									</div>
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

	let url = process.env.URL
	return {
		props: {
			data,
			url
		}
	}
}
