import type { NextApiRequest, NextApiResponse } from "next"
import cookies from "next-cookies"
import Gift from "../../../models/Gift"
import { connectMongo } from "../../../utils/connect"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		const { code } = req.query
		const codeCookie = req.headers["code-cookie"]

		if (!code)
			return res
				.status(400)
				.json({ error: "It seems that you didn't enter a code" })

		await connectMongo()

		let type = null
		let data = undefined
		let error
		let redeemed = false

		if (code.length === 4) {
			data = await Gift.findOne({ code }).catch((err) => console.log(err))
			type = "code"
		} else if (code.length === 24) {
			data = await Gift.findById(code.toString()).catch((err) =>
				console.log(err)
			)
			type = "id"
		}

		if (codeCookie === data?._id?.toString() && codeCookie) {
			return res.status(200).json({
				data: JSON.stringify(data),
				type,
				redeemed
			})
		} else if (type === "code" && data) {
			if (type === "code") {
				if (data.redeemsLeft < 1) {
					error = "Sorry! This code has already been redeemed or has expired"
				} else {
					data.redeemsLeft--
					await data.save()
					redeemed = true
				}
			}
		}

		if (error) {
			return res.status(400).json({ error })
		}

		if (data) {
			return res.status(200).json({
				data: JSON.stringify(data),
				type,
				redeemed
			})
		}

		return res
			.status(404)
			.json({ error: "Sorry! No gift was found with that code" })
	}
}
