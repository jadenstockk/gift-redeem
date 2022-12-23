import mongoose from "mongoose"
import { config } from "dotenv"
config()

export const connectMongo = async () =>
	mongoose.connect(process.env.MONGO_URI!, {})
