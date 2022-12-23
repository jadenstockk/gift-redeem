import Head from "next/head"
import type { NextPageContext } from "next"
import Image from "next/image"
import { connectMongo } from "../../utils/connect"
import Gift from "../../models/Gift"
import cookies from "next-cookies"
import Link from "next/link"
import Router from "next/router"
import { useState } from "react"

interface PropsInterface {
	error?: string
	data?: any
	image?: string
	redeemed?: boolean
}

export default function Gifts({
	error,
	data,
	image,
	redeemed
}: PropsInterface) {
	const [giftImage, setGiftImage] = useState("/gift.png")

	return (
		<>
			<Head>
				<title>Jaden&apos;s Gift Code Redeem</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				{error ? (
					<div className="bg-red-600 w-fit mx-auto my-5 rounded-3xl px-5 py-1 text-center">
						<p className="text-stone-100 font-semibold">{error}</p>
					</div>
				) : null}

				{image ? (
					<Image
						className="mx-auto my-5"
						src={image}
						width={150}
						height={0}
						alt=""
					/>
				) : null}

				{data ? (
					<div className="text-center">
						<h1 className="text-slate-300 font-semibold text-4xl">
							A gift
							{data.recipient?.nickName ? (
								<>
									<span> for </span>
									<span className="text-white font-bold text-4xl">
										{data?.recipient?.nickName || "You"}
									</span>
								</>
							) : (
								""
							)}{" "}
							from <span className="text-white font-bold text-4xl">Jaden</span>
						</h1>
						{redeemed ? (
							<p className="text-white bg-green-700 w-fit mx-auto mt-2 rounded-xl px-2">
								Successfully Redeemed
							</p>
						) : null}

						<Image
							id="giftImage"
							className="float mx-auto my-16"
							src={giftImage}
							width={250}
							height={0}
							alt="Christmas Present"
						/>
						<button
							id="unwrapButton"
							className="shine text-white font-bold text-3xl bg-red-600 rounded-3xl px-5 py-2 mb-10"
							onClick={() => {
								let giftImage = document.getElementById("giftImage")!
								giftImage.classList.remove("float")
								giftImage.classList.add("shake")
								let unwrapButton = document.getElementById("unwrapButton")!
								unwrapButton.innerHTML = "Unwrapping..."
								unwrapButton.style.background = "#A7A7A7"
								setTimeout(() => {
									setGiftImage("/gift-open.png")
									giftImage.classList.remove("shake")
									unwrapButton.innerHTML = "Unwrapped!"
								}, 3000)
								setTimeout(() => {
									if (data.type && data._id) {
										Router.push(`/gifts/${data.type}/${data._id}`)
									} else {
										Router.push("/")
									}
								}, 5000)
							}}
						>
							Unwrap Gift
						</button>
					</div>
				) : (
					<div className="text-center text-white">
						<p className=" font-bold text-2xl mt-10 mb-3">
							🎁 There are no gifts here...
						</p>
						<Link
							href={data?.type ? `/${data.type || ""}?id=${data._id}` : "/"}
							className="text-white font-medium text-l bg-slate-600 rounded-3xl px-5 py-2"
						>
							Redeem a different code
						</Link>
					</div>
				)}
			</main>
		</>
	)
}

export async function getServerSideProps(context: NextPageContext) {
	const { code } = context.query

	const cookie = cookies(context)[code as string]

	let { data, error, type, redeemed } = await (
		await fetch(process.env.URL + "/api/gifts/" + code, {
			method: "POST",
			headers: {
				"code-cookie": cookie || ""
			}
		})
	).json()

	if (data) data = JSON.parse(data)

	if (error) {
		return {
			props: { error: error }
		}
	}

	if (type === "code" && data) {
		context.res?.setHeader(
			"Set-Cookie",
			code + "=" + data._id + "; Max-Age=2592000"
		)
	}

	if (data) {
		let image
		if (data.event === "christmas") image = "/merry-christmas.png"
		return {
			props: { data, image, redeemed }
		}
	}

	return {
		props: { error: "Sorry! It seems that something went wrong..." }
	}
}
