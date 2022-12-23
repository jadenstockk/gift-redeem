import Head from "next/head"
import type { NextPageContext } from "next"
import Image from "next/image"
import { QrReader } from "react-qr-reader"
import { useState } from "react"

export default function QRHunt() {
	return (
		<>
			<Head>
				<title>Jaden&apos;s QR Code Hunt Gift Redeem</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="text-white text-center m-20 font-semibold text-xl">
				<h2 className="font-bold text-3xl mb-2">
					👋 You have reached the QR Hunt page
				</h2>
				<p>
					Unfortunately you are not allowed to use this page without a gift id
				</p>
			</main>
		</>
	)
}
